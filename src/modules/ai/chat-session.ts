import type { AIClient } from "./client";
import { AIError, type AIErrorKind } from "./errors";
import {
  buildActionPrompt,
  buildSystemPrompt,
  type ChatAction,
  type ChatMessage,
  fitToBudget,
  type PaperContext,
} from "./prompts";

export interface SessionMessage {
  id: number;
  role: "user" | "assistant";
  /** Text sent to the model */
  content: string;
  /** Text shown in the bubble (user action messages show the quote, not the prompt) */
  display: string;
  action?: ChatAction;
  status: "streaming" | "done" | "error";
  errorKind?: AIErrorKind;
  errorDetail?: string;
  timestamp: number;
}

export type SessionEvent =
  | { type: "append"; message: SessionMessage }
  | { type: "update"; message: SessionMessage }
  | { type: "reset" }
  | { type: "busy"; busy: boolean };

type Client = Pick<AIClient, "loadConfig" | "streamChat">;

let nextID = 1;

/** One conversation, bound to a single Zotero item. */
export class ChatSession {
  public readonly messages: SessionMessage[] = [];
  private listeners = new Set<(e: SessionEvent) => void>();
  private cancelCurrent: (() => void) | null = null;

  constructor(private client: Client) {}

  public get busy(): boolean {
    return this.cancelCurrent !== null;
  }

  public subscribe(fn: (e: SessionEvent) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /**
   * Run an action (or free-form question) and stream the reply.
   * Resolves when the reply finishes or fails; never rejects.
   */
  public async send(
    action: ChatAction,
    text: string,
    paper: PaperContext | null,
  ): Promise<void> {
    if (this.busy) this.cancel();

    const user = this.push({
      role: "user",
      content: "",
      display: text,
      action,
      status: "done",
    });
    const reply = this.push({
      role: "assistant",
      content: "",
      display: "",
      status: "streaming",
    });

    let config;
    try {
      config = this.client.loadConfig();
    } catch (e) {
      this.fail(reply, e);
      return;
    }

    user.content = buildActionPrompt(action, text, config.targetLanguage, paper);
    const system = buildSystemPrompt(config.systemPrompt, paper);
    const request = fitToBudget(system, this.history(), config.maxContextTokens);

    const handle = this.client.streamChat(request, (_delta, full) => {
      reply.content = full;
      reply.display = full;
      this.emit({ type: "update", message: reply });
    });
    this.setCancel(handle.cancel);

    try {
      const full = await handle.done;
      reply.content = full;
      reply.display = full;
      reply.status = "done";
      this.emit({ type: "update", message: reply });
    } catch (e) {
      this.fail(reply, e);
    } finally {
      // A newer send() may already own the cancel slot
      if (this.cancelCurrent === handle.cancel) this.setCancel(null);
    }
  }

  public cancel(): void {
    const cancel = this.cancelCurrent;
    this.setCancel(null);
    cancel?.();
  }

  public clear(): void {
    this.cancel();
    this.messages.length = 0;
    this.emit({ type: "reset" });
  }

  /**
   * Completed exchanges plus the pending user message. Failed exchanges are
   * left out so an error doesn't poison later requests.
   */
  private history(): ChatMessage[] {
    const out: ChatMessage[] = [];
    const msgs = this.messages;
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i];
      if (m.role !== "user") continue;
      const next = msgs[i + 1];
      if (next?.role === "assistant" && next.status === "done") {
        out.push({ role: "user", content: m.content });
        out.push({ role: "assistant", content: next.content });
      } else if (next?.status === "streaming" && i + 2 === msgs.length) {
        // The exchange being sent now
        out.push({ role: "user", content: m.content });
      }
    }
    return out;
  }

  private push(m: Omit<SessionMessage, "id" | "timestamp">): SessionMessage {
    const message: SessionMessage = { ...m, id: nextID++, timestamp: Date.now() };
    this.messages.push(message);
    this.emit({ type: "append", message });
    return message;
  }

  private fail(reply: SessionMessage, e: unknown): void {
    const err =
      e instanceof AIError ? e : new AIError("unknown", String((e as any)?.message ?? e));
    reply.status = "error";
    reply.errorKind = err.kind;
    reply.errorDetail = err.message;
    this.emit({ type: "update", message: reply });
  }

  private setCancel(fn: (() => void) | null): void {
    const was = this.busy;
    this.cancelCurrent = fn;
    if (was !== this.busy) this.emit({ type: "busy", busy: this.busy });
  }

  private emit(e: SessionEvent): void {
    for (const fn of this.listeners) {
      try {
        fn(e);
      } catch (err) {
        // A broken view must not break the session
        Zotero.debug("[ZoteroAIReader] Session listener error: " + String(err));
      }
    }
  }
}

/** Sessions keyed by Zotero item ID; live for the plugin lifetime. */
export class SessionStore {
  private static sessions = new Map<number, ChatSession>();
  private static client: Client | null = null;

  public static init(client: Client): void {
    this.client = client;
  }

  public static get(itemID: number): ChatSession {
    let s = this.sessions.get(itemID);
    if (!s) {
      if (!this.client) throw new Error("SessionStore not initialized");
      s = new ChatSession(this.client);
      this.sessions.set(itemID, s);
    }
    return s;
  }

  public static cancelAll(): void {
    for (const s of this.sessions.values()) s.cancel();
  }

  public static reset(): void {
    this.cancelAll();
    this.sessions.clear();
  }
}
