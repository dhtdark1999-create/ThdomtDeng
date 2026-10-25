import { getString } from "../../utils/locale";
import { getPref } from "../../utils/prefs";
import { type ChatSession, type SessionMessage, SessionStore } from "../ai/chat-session";
import { errorLocaleKey } from "../ai/errors";
import type { ChatAction } from "../ai/prompts";
import { ReaderEventHub } from "../reader/event-hub";
import { h, truncate } from "./dom";
import { renderMarkdown } from "./markdown";

const STYLE_ID = "ai-reader-style";

/**
 * Chat UI inside one item-pane section body. The section instance may be
 * reused across items (switching reader tabs), so `bind()` swaps sessions.
 */
export class SidebarView {
  private static views = new Set<SidebarView>();

  private item: Zotero.Item | null = null;
  private session: ChatSession | null = null;
  private unsubSession: (() => void) | null = null;
  private unsubSelection: (() => void) | null = null;
  private bubbles = new Map<number, HTMLElement>();

  private root!: HTMLElement;
  private meta!: HTMLElement;
  private quote!: HTMLElement;
  private actions!: HTMLElement;
  private log!: HTMLElement;
  private input!: HTMLTextAreaElement;
  private sendBtn!: HTMLButtonElement;
  private stopBtn!: HTMLButtonElement;
  private hint!: HTMLElement;

  constructor(
    private body: HTMLElement,
    private paneID: string,
  ) {
    this.build();
    SidebarView.views.add(this);
    this.unsubSelection = ReaderEventHub.getInstance().onSelection((sel) => {
      if (this.item?.id === sel.itemID) this.onSelection(sel.text);
    });
  }

  /** Find the live view showing `itemID`, if the pane is open. */
  public static forItem(itemID: number): SidebarView | null {
    for (const v of this.views) if (v.item?.id === itemID && v.body.isConnected) return v;
    return null;
  }

  public static destroyAll(): void {
    for (const v of [...this.views]) v.destroy();
  }

  public bind(item: Zotero.Item): void {
    const regular = ReaderEventHub.regularItem(item);
    if (this.item?.id === regular.id && this.session) {
      this.renderMeta();
      this.updateConfigHint();
      return;
    }
    this.item = regular;
    this.unsubSession?.();
    this.session = SessionStore.get(regular.id);
    this.unsubSession = this.session.subscribe((e) => {
      switch (e.type) {
        case "append":
          this.appendMessage(e.message);
          break;
        case "update":
          this.updateMessage(e.message);
          break;
        case "reset":
          this.renderAllMessages();
          break;
        case "busy":
          this.setBusy(e.busy);
          break;
      }
    });
    this.renderMeta();
    this.setQuote(ReaderEventHub.getInstance().getSelectedText(regular.id));
    this.renderAllMessages();
    this.setBusy(this.session.busy);
    this.updateConfigHint();
  }

  public destroy(): void {
    this.unsubSession?.();
    this.unsubSelection?.();
    this.unsubSession = this.unsubSelection = null;
    SidebarView.views.delete(this);
  }

  /** Run an action on text, e.g. from the reader's selection popup. */
  public run(action: ChatAction, text: string): void {
    if (!this.session || !this.item) return;
    this.setQuote(text);
    this.reveal();
    void this.session.send(action, text, ReaderEventHub.getPaperContext(this.item));
  }

  public summary(): string {
    const text = this.item ? ReaderEventHub.getInstance().getSelectedText(this.item.id) : "";
    return text ? truncate(text, 30) : getString("reader-sidebar-status-ready");
  }

  // ---- building ----

  private build(): void {
    const doc = this.body.ownerDocument;
    this.ensureStyle(doc);
    const btn = (label: string, action: ChatAction) => {
      const b = h(doc, "button", { type: "button", class: "air-btn" }, [label]);
      b.addEventListener("click", () => this.runOnQuote(action));
      return b;
    };

    this.meta = h(doc, "div", { class: "air-meta" });
    this.quote = h(doc, "blockquote", { class: "air-quote", hidden: true });
    this.actions = h(doc, "div", { class: "air-actions", role: "toolbar" }, [
      btn(getString("action-translate"), "translate"),
      btn(getString("action-explain"), "explain"),
      btn(getString("action-summarize"), "summarize"),
    ]);
    this.hint = h(doc, "div", { class: "air-hint", hidden: true });
    this.log = h(doc, "div", {
      class: "air-log",
      role: "log",
      "aria-live": "polite",
      "aria-label": getString("chat-log-label"),
    });

    this.input = h(doc, "textarea", {
      class: "air-input",
      rows: "2",
      placeholder: getString("chat-input-placeholder"),
      "aria-label": getString("chat-input-placeholder"),
    });
    this.input.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        this.submitInput();
      }
      // Keep reader/item-pane shortcuts from eating keystrokes
      e.stopPropagation();
    });
    this.sendBtn = h(doc, "button", { type: "button", class: "air-btn air-primary" }, [
      getString("chat-send"),
    ]);
    this.sendBtn.addEventListener("click", () => this.submitInput());
    this.stopBtn = h(doc, "button", { type: "button", class: "air-btn", hidden: true }, [
      getString("chat-stop"),
    ]);
    this.stopBtn.addEventListener("click", () => this.session?.cancel());
    const clearBtn = h(doc, "button", { type: "button", class: "air-btn air-ghost" }, [
      getString("chat-clear"),
    ]);
    clearBtn.addEventListener("click", () => this.session?.clear());

    this.root = h(doc, "div", { class: "air-root" }, [
      this.meta,
      this.quote,
      this.actions,
      this.hint,
      this.log,
      h(doc, "div", { class: "air-compose" }, [
        this.input,
        h(doc, "div", { class: "air-compose-row" }, [clearBtn, this.stopBtn, this.sendBtn]),
      ]),
    ]);
    this.body.replaceChildren(this.root);
  }

  private ensureStyle(doc: Document): void {
    if (doc.getElementById(STYLE_ID)) return;
    const link = h(doc, "link", {
      id: STYLE_ID,
      rel: "stylesheet",
      href: `chrome://${addon.data.config.addonRef}/content/sidebar.css`,
    });
    (doc.head || doc.documentElement).appendChild(link);
  }

  // ---- rendering ----

  private renderMeta(): void {
    const doc = this.body.ownerDocument;
    const paper = ReaderEventHub.getPaperContext(this.item);
    if (!paper) {
      this.meta.replaceChildren();
      return;
    }
    this.meta.replaceChildren(h(doc, "div", { class: "air-title" }, [paper.title || getString("untitled")]));
    if (paper.authors.length) {
      this.meta.append(h(doc, "div", { class: "air-authors" }, [truncate(paper.authors.join(", "), 120)]));
    }
  }

  private setQuote(text: string): void {
    this.quote.textContent = text ? truncate(text, 600) : "";
    this.quote.hidden = !text;
    this.quote.dataset.full = text;
  }

  private renderAllMessages(): void {
    this.bubbles.clear();
    this.log.replaceChildren();
    const msgs = this.session?.messages ?? [];
    if (!msgs.length) {
      this.log.appendChild(
        h(this.body.ownerDocument, "div", { class: "air-placeholder" }, [
          getString("reader-sidebar-placeholder"),
        ]),
      );
      return;
    }
    for (const m of msgs) this.appendMessage(m);
  }

  private appendMessage(m: SessionMessage): void {
    this.log.querySelector(".air-placeholder")?.remove();
    const bubble = h(this.body.ownerDocument, "div", {
      class: `air-msg air-${m.role}`,
    });
    this.bubbles.set(m.id, bubble);
    this.fillBubble(bubble, m);
    this.log.appendChild(bubble);
    this.scrollToEnd();
  }

  private updateMessage(m: SessionMessage): void {
    const bubble = this.bubbles.get(m.id);
    if (!bubble) return;
    const nearBottom = this.isNearBottom();
    this.fillBubble(bubble, m);
    if (nearBottom) this.scrollToEnd();
  }

  private fillBubble(bubble: HTMLElement, m: SessionMessage): void {
    const doc = this.body.ownerDocument;
    bubble.classList.toggle("air-streaming", m.status === "streaming");
    bubble.classList.toggle("air-error", m.status === "error");

    if (m.role === "user") {
      const label = m.action && m.action !== "ask" ? getString(`action-${m.action}`) : null;
      bubble.replaceChildren(h(doc, "span", {}, [truncate(m.display || getString("summarize-paper"), 400)]));
      if (label) bubble.prepend(h(doc, "span", { class: "air-tag" }, [label]));
      return;
    }

    if (m.status === "error") {
      const msg = getString(errorLocaleKey(m.errorKind || "unknown"));
      const children: Node[] = [];
      if (m.display) children.push(renderMarkdown(doc, m.display));
      children.push(h(doc, "div", { class: "air-error-text", role: "alert" }, [msg]));
      if (m.errorDetail && m.errorKind !== "aborted") {
        children.push(h(doc, "div", { class: "air-error-detail" }, [truncate(m.errorDetail, 300)]));
      }
      if (m.errorKind === "config") {
        const open = h(doc, "button", { type: "button", class: "air-btn" }, [
          getString("open-settings"),
        ]);
        open.addEventListener("click", () => openSettings());
        children.push(open);
      }
      bubble.replaceChildren(...children);
      return;
    }

    if (!m.display) {
      bubble.replaceChildren(h(doc, "span", { class: "air-typing" }, [getString("chat-thinking")]));
      return;
    }
    bubble.replaceChildren(renderMarkdown(doc, m.display));
    if (m.status === "done") {
      const copy = h(doc, "button", { type: "button", class: "air-copy", title: getString("chat-copy") }, [
        getString("chat-copy"),
      ]);
      copy.addEventListener("click", () => Zotero.Utilities.Internal.copyTextToClipboard(m.content));
      bubble.appendChild(copy);
    }
  }

  private setBusy(busy: boolean): void {
    this.stopBtn.hidden = !busy;
  }

  private updateConfigHint(): void {
    const configured = Boolean(getPref("endpoint")) && Boolean(getPref("apiKey"));
    this.hint.hidden = configured;
    if (!configured && !this.hint.firstChild) {
      const open = h(this.body.ownerDocument, "button", { type: "button", class: "air-link" }, [
        getString("open-settings"),
      ]);
      open.addEventListener("click", () => openSettings());
      this.hint.append(getString("error-config") + " ", open);
    }
  }

  private isNearBottom(): boolean {
    const l = this.log;
    return l.scrollHeight - l.scrollTop - l.clientHeight < 40;
  }

  private scrollToEnd(): void {
    this.log.scrollTop = this.log.scrollHeight;
  }

  /** Scroll the item pane so this section is visible. */
  private reveal(): void {
    const details = this.body.closest("item-details") as any;
    details?.scrollToPane?.(this.paneID, "smooth");
  }

  // ---- actions ----

  private onSelection(text: string): void {
    this.setQuote(text);
    if (getPref("autoMode") && !this.session?.busy) {
      this.run("translate", text);
    }
  }

  private runOnQuote(action: ChatAction): void {
    const text = this.quote.dataset.full || "";
    if (!text && action !== "summarize") {
      this.flashHint(getString("need-selection"));
      return;
    }
    this.run(action, text);
  }

  private submitInput(): void {
    const text = this.input.value.trim();
    if (!text || !this.session || !this.item) return;
    this.input.value = "";
    void this.session.send("ask", text, ReaderEventHub.getPaperContext(this.item));
  }

  private flashHint(text: string): void {
    const doc = this.body.ownerDocument;
    const note = h(doc, "div", { class: "air-placeholder", role: "status" }, [text]);
    this.log.appendChild(note);
    this.scrollToEnd();
    setTimeout(() => note.remove(), 3000);
  }
}

export function openSettings(): void {
  Zotero.Utilities.Internal.openPreferences(addon.data.prefPaneID || "");
}
