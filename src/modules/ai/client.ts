import { getPref } from "../../utils/prefs";
import { AIError, kindFromStatus } from "./errors";
import type { ChatMessage } from "./prompts";
import { extractErrorMessage, SSEParser } from "./sse";

export interface AIConfig {
  endpoint: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  targetLanguage: string;
  maxContextTokens: number;
}

export interface StreamHandle {
  /** Resolves with the full reply, rejects with an AIError. */
  done: Promise<string>;
  cancel: () => void;
}

const REQUEST_TIMEOUT_MS = 120_000;

/**
 * Accept either a full chat-completions URL or an OpenAI-style base URL
 * (e.g. `https://api.openai.com/v1`) and return the completions URL.
 */
export function normalizeEndpoint(endpoint: string): string {
  const url = endpoint.trim().replace(/\/+$/, "");
  if (!url) return "";
  if (/\/chat\/completions$/.test(url)) return url;
  if (/\/v\d+[a-z]*$/.test(url)) return `${url}/chat/completions`;
  return url;
}

export class AIClient {
  /** Read config from prefs. Throws AIError("config") if incomplete. */
  public loadConfig(): AIConfig {
    const endpoint = normalizeEndpoint(getPref("endpoint") || "");
    const apiKey = (getPref("apiKey") || "").trim();
    if (!endpoint || !apiKey) {
      throw new AIError("config", "Endpoint or API key is not set");
    }
    return {
      endpoint,
      apiKey,
      model: (getPref("model") || "").trim() || "gpt-4o-mini",
      systemPrompt: getPref("systemPrompt") || "",
      targetLanguage: getPref("targetLanguage") || "简体中文",
      maxContextTokens: Number(getPref("maxContextTokens")) || 6000,
    };
  }

  public isConfigured(): boolean {
    try {
      this.loadConfig();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Send a chat request with `stream: true` and report deltas as they arrive.
   * Falls back to a regular JSON body if the endpoint ignores streaming.
   *
   * Uses Zotero.HTTP.request rather than fetch: the bootstrap sandbox has no
   * window globals, and XHR `onprogress` gives us incremental SSE text.
   */
  public streamChat(
    messages: ChatMessage[],
    onDelta: (delta: string, full: string) => void,
  ): StreamHandle {
    const parser = new SSEParser();
    let content = "";
    let cancelled = false;
    let canceller: (() => void) | null = null;
    let xhrRef: XMLHttpRequest | null = null;

    const emit = (deltas: string[]) => {
      for (const d of deltas) {
        content += d;
        onDelta(d, content);
      }
    };

    const done = (async () => {
      const config = this.loadConfig();
      let xhr: XMLHttpRequest;
      try {
        xhr = (await Zotero.HTTP.request("POST", config.endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages,
            stream: true,
          }),
          responseType: "text",
          successCodes: false,
          timeout: REQUEST_TIMEOUT_MS,
          errorDelayMax: 0,
          requestObserver: (x: XMLHttpRequest) => {
            xhrRef = x;
            x.onprogress = () => {
              if (x.status >= 200 && x.status < 300) {
                emit(parser.feedAccumulated(x.responseText));
              }
            };
          },
          cancellerReceiver: (c: () => void) => {
            canceller = c;
          },
        })) as unknown as XMLHttpRequest;
      } catch (e) {
        throw toAIError(e, cancelled);
      }

      if (cancelled) throw new AIError("aborted", "Request cancelled");

      const status = xhr.status;
      const body = xhr.responseText || "";
      if (status < 200 || status >= 300) {
        throw new AIError(kindFromStatus(status), extractErrorMessage(body), status);
      }

      emit(parser.feedAccumulated(body));
      emit(parser.flush());

      if (!content) {
        // Endpoint ignored `stream: true` and returned a normal JSON body
        try {
          const json = JSON.parse(body);
          const text = json?.choices?.[0]?.message?.content;
          if (typeof text === "string" && text) emit([text]);
        } catch {
          // Not JSON either
        }
      }
      if (!content) {
        throw new AIError("unknown", extractErrorMessage(body) || "Empty response");
      }
      return content;
    })();

    return {
      done,
      cancel: () => {
        cancelled = true;
        if (canceller) canceller();
        else xhrRef?.abort();
      },
    };
  }
}

function toAIError(e: unknown, cancelled: boolean): AIError {
  if (e instanceof AIError) return e;
  if (cancelled) return new AIError("aborted", "Request cancelled");
  const err = e as any;
  const name = String(err?.name || err?.constructor?.name || "");
  const message = String(err?.message || err || "");
  if (/Timeout/i.test(name) || /timed? ?out/i.test(message)) {
    return new AIError("timeout", message);
  }
  if (/Offline/i.test(name)) return new AIError("network", message);
  const status = Number(err?.status ?? err?.xmlhttp?.status);
  if (!Number.isNaN(status)) {
    const body = err?.xmlhttp?.responseText || "";
    return new AIError(kindFromStatus(status), extractErrorMessage(body) || message, status);
  }
  return new AIError("network", message);
}
