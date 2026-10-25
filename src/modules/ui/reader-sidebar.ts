import { getLocaleID, getString } from "../../utils/locale";
import { SessionStore } from "../ai/chat-session";
import type { ChatAction } from "../ai/prompts";
import { ReaderEventHub, type Selection } from "../reader/event-hub";
import { h } from "./dom";
import { SidebarView } from "./sidebar-view";

const PANE_ID = "ai-reader-sidebar";

/** Run a section hook, logging failures to the Error Console instead of swallowing them. */
function guard(hook: string, fn: () => void): void {
  try {
    fn();
  } catch (e) {
    Zotero.debug(`[ZoteroAIReader] Sidebar ${hook} failed: ${String(e)}
${(e as Error)?.stack ?? ""}`);
    Zotero.logError(e as Error);
  }
}

export class ReaderSidebarFactory {
  private static views = new WeakMap<HTMLElement, SidebarView>();
  private static sectionKey: string | false = false;

  public static registerReaderSidebar() {
    this.sectionKey = Zotero.ItemPaneManager.registerSection({
      paneID: PANE_ID,
      pluginID: addon.data.config.addonID,
      header: {
        l10nID: getLocaleID("reader-sidebar-header"),
        icon: `chrome://${addon.data.config.addonRef}/content/icons/sidenav-16.svg`,
      },
      sidenav: {
        l10nID: getLocaleID("reader-sidebar-sidenav-tooltip"),
        icon: `chrome://${addon.data.config.addonRef}/content/icons/sidenav-20.svg`,
      },
      // Zotero only calls onRender when it thinks the section is stale, and
      // re-creates the body when the pane is re-attached. Bind the item in
      // every hook that receives one so the view never stays unbound.
      onInit: ({ body, item }) => {
        guard("init", () => this.viewFor(body, item));
      },
      onDestroy: ({ body }) => {
        this.views.get(body)?.destroy();
        this.views.delete(body);
      },
      onItemChange: ({ body, item, setEnabled, tabType }) => {
        setEnabled(tabType === "reader");
        if (tabType === "reader") guard("itemChange", () => this.viewFor(body, item));
        return true;
      },
      onRender: ({ body, item, setSectionSummary }) => {
        guard("render", () => {
          const view = this.viewFor(body, item);
          setSectionSummary(view.summary());
        });
      },
    });

    Zotero.debug("[ZoteroAIReader] registerSection returned " + String(this.sectionKey));
    ReaderEventHub.getInstance().popupDecorator = (doc, append, sel) =>
      this.decoratePopup(doc, append, sel);
  }

  /** Get (or lazily create) the view for a section body and bind the item. */
  private static viewFor(body: HTMLDivElement, item: Zotero.Item | undefined): SidebarView {
    let view = this.views.get(body);
    if (!view) {
      Zotero.debug("[ZoteroAIReader] Creating sidebar view");
      view = new SidebarView(body, PANE_ID);
      this.views.set(body, view);
    }
    if (item) view.bind(item);
    return view;
  }

  public static unregisterReaderSidebar() {
    ReaderEventHub.getInstance().popupDecorator = null;
    SidebarView.destroyAll();
    if (this.sectionKey) {
      Zotero.ItemPaneManager.unregisterSection(this.sectionKey);
      this.sectionKey = false;
    }
  }

  /** Add quick-action buttons to the reader's text selection popup. */
  private static decoratePopup(
    doc: Document,
    append: (...n: Node[]) => void,
    sel: Selection,
  ): void {
    const btn = (action: ChatAction) => {
      const b = h(doc, "button", { type: "button", class: "toolbar-button wide-button" }, [
        getString(`popup-${action}`),
      ]);
      b.style.cssText = "margin: 2px 4px 0 0; padding: 2px 8px;";
      b.addEventListener("click", () => {
        const view = SidebarView.forItem(sel.itemID);
        if (view) {
          view.run(action, sel.text);
        } else {
          // Pane is collapsed: still run, the reply shows when it's opened
          const item = Zotero.Items.get(sel.itemID);
          void SessionStore.get(sel.itemID).send(action, sel.text, ReaderEventHub.getPaperContext(item));
        }
      });
      return b;
    };
    const row = h(doc, "div", {}, [btn("translate"), btn("explain")]);
    row.style.cssText = "display: flex; flex-wrap: wrap; padding: 4px 0 2px;";
    append(row);
  }
}
