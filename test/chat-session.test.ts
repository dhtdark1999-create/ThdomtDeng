import { describe, expect, it } from "vitest";
import { ChatSession } from "../src/modules/ai/chat-session";
import type { AIConfig, StreamHandle } from "../src/modules/ai/client";
import { AIError } from "../src/modules/ai/errors";
import type { ChatMessage } from "../src/modules/ai/prompts";

const config: AIConfig = {
  endpoint: "https://example.test/v1/chat/completions",
  apiKey: "test-key",
  model: "m",
  systemPrompt: "SYS",
  targetLanguage: "English",
  maxContextTokens: 6000,
};

/** Fake client that streams scripted replies, or fails with a scripted error. */
function fakeClient(replies: Array<string | AIError>, opts: { configError?: boolean } = {}) {
  const requests: ChatMessage[][] = [];
  let cancelled = 0;
  return {
    requests,
    get cancelled() {
      return cancelled;
    },
    loadConfig() {
      if (opts.configError) throw new AIError("config", "not set");
      return config;
    },
    streamChat(messages: ChatMessage[], onDelta: (d: string, full: string) => void): StreamHandle {
      requests.push(messages);
      const reply = replies.shift() ?? "";
      const done = (async () => {
        if (reply instanceof AIError) throw reply;
        let full = "";
        for (const part of reply.split(" ")) {
          full += (full ? " " : "") + part;
          onDelta(part, full);
          await Promise.resolve();
        }
        return full;
      })();
      return { done, cancel: () => cancelled++ };
    },
  };
}

describe("ChatSession", () => {
  it("streams a reply and records both messages", async () => {
    const client = fakeClient(["Bonjour le monde"]);
    const s = new ChatSession(client);
    const updates: string[] = [];
    s.subscribe((e) => {
      if (e.type === "update") updates.push(e.message.display);
    });

    await s.send("translate", "Hello world", null);

    expect(s.messages.map((m) => [m.role, m.status])).toEqual([
      ["user", "done"],
      ["assistant", "done"],
    ]);
    expect(s.messages[0].display).toBe("Hello world");
    expect(s.messages[0].content).toContain("Translate");
    expect(s.messages[1].content).toBe("Bonjour le monde");
    expect(updates).toContain("Bonjour");
    expect(s.busy).toBe(false);

    const req = client.requests[0];
    expect(req[0]).toEqual({ role: "system", content: "SYS" });
    expect(req.at(-1)!.role).toBe("user");
  });

  it("sends prior exchanges as history", async () => {
    const client = fakeClient(["first answer", "second answer"]);
    const s = new ChatSession(client);
    await s.send("ask", "Q1", null);
    await s.send("ask", "Q2", null);
    expect(client.requests[1].map((m) => m.content)).toEqual(["SYS", "Q1", "first answer", "Q2"]);
  });

  it("marks failures and leaves them out of later history", async () => {
    const client = fakeClient([new AIError("rateLimit", "slow down", 429), "ok"]);
    const s = new ChatSession(client);
    await s.send("ask", "Q1", null);
    expect(s.messages[1].status).toBe("error");
    expect(s.messages[1].errorKind).toBe("rateLimit");

    await s.send("ask", "Q2", null);
    expect(client.requests[1].map((m) => m.content)).toEqual(["SYS", "Q2"]);
  });

  it("reports missing config without calling the API", async () => {
    const client = fakeClient([], { configError: true });
    const s = new ChatSession(client);
    await s.send("ask", "Q", null);
    expect(client.requests).toHaveLength(0);
    expect(s.messages[1].errorKind).toBe("config");
  });

  it("cancels an in-flight request when a new one is sent and on clear", async () => {
    const client = fakeClient(["a b c", "d"]);
    const s = new ChatSession(client);
    const first = s.send("ask", "Q1", null);
    expect(s.busy).toBe(true);
    const second = s.send("ask", "Q2", null);
    expect(client.cancelled).toBe(1);
    await Promise.all([first, second]);

    s.clear();
    expect(s.messages).toHaveLength(0);
  });
});
