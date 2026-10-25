import { describe, expect, it } from "vitest";
import { normalizeEndpoint } from "../src/modules/ai/client";
import { kindFromStatus } from "../src/modules/ai/errors";
import {
  buildActionPrompt,
  buildSystemPrompt,
  type ChatMessage,
  DEFAULT_SYSTEM_PROMPT,
  fitToBudget,
} from "../src/modules/ai/prompts";
import { estimateTokens } from "../src/utils/token-counter";

const paper = {
  title: "Attention Is All You Need",
  abstract: "We propose the Transformer.",
  authors: ["Ashish Vaswani"],
  tags: ["NLP"],
  itemType: "conferencePaper",
};

describe("estimateTokens", () => {
  it("counts CJK characters individually and Latin text by ~4 chars", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("abcdefgh")).toBe(2);
    expect(estimateTokens("注意力机制")).toBe(5);
    expect(estimateTokens("注意 abcd")).toBe(2 + 2);
  });
});

describe("buildSystemPrompt", () => {
  it("uses the default prompt when custom is blank", () => {
    expect(buildSystemPrompt("  ", null)).toBe(DEFAULT_SYSTEM_PROMPT);
  });

  it("appends paper background", () => {
    const s = buildSystemPrompt("Be brief.", paper);
    expect(s.startsWith("Be brief.")).toBe(true);
    expect(s).toContain("Title: Attention Is All You Need");
    expect(s).toContain("Authors: Ashish Vaswani");
    expect(s).toContain("Abstract: We propose the Transformer.");
  });
});

describe("buildActionPrompt", () => {
  it("includes target language and text", () => {
    const p = buildActionPrompt("translate", "Hello", "简体中文");
    expect(p).toContain("简体中文");
    expect(p.endsWith("Hello")).toBe(true);
  });

  it("summarizes the paper when there is no selection", () => {
    const p = buildActionPrompt("summarize", "", "English", paper);
    expect(p).toContain("We propose the Transformer.");
  });

  it("passes free-form questions through", () => {
    expect(buildActionPrompt("ask", "Why?", "English")).toBe("Why?");
  });
});

describe("fitToBudget", () => {
  const msg = (role: ChatMessage["role"], n: number): ChatMessage => ({
    role,
    content: "x".repeat(n * 4),
  });

  it("keeps everything when under budget", () => {
    const history = [msg("user", 10), msg("assistant", 10), msg("user", 10)];
    const out = fitToBudget("sys", history, 1000);
    expect(out).toHaveLength(4);
    expect(out[0]).toEqual({ role: "system", content: "sys" });
  });

  it("drops oldest messages first and never starts on an assistant reply", () => {
    const history = [msg("user", 100), msg("assistant", 100), msg("user", 100), msg("assistant", 100), msg("user", 100)];
    const out = fitToBudget("", history, 250);
    expect(out.map((m) => m.role)).toEqual(["user"]);
    expect(out[0]).toBe(history[4]);
  });

  it("keeps the latest message even if it exceeds the budget", () => {
    const history = [msg("user", 10), msg("assistant", 10), msg("user", 5000)];
    const out = fitToBudget("", history, 100);
    expect(out).toEqual([history[2]]);
  });
});

describe("normalizeEndpoint", () => {
  it("accepts base URLs and full URLs", () => {
    expect(normalizeEndpoint("https://api.openai.com/v1")).toBe("https://api.openai.com/v1/chat/completions");
    expect(normalizeEndpoint("https://api.openai.com/v1/")).toBe("https://api.openai.com/v1/chat/completions");
    expect(normalizeEndpoint("https://x.com/v1/chat/completions")).toBe("https://x.com/v1/chat/completions");
    expect(normalizeEndpoint("https://open.bigmodel.cn/api/paas/v4")).toBe(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    );
    expect(normalizeEndpoint("https://api.deepseek.com")).toBe("https://api.deepseek.com/chat/completions");
    expect(normalizeEndpoint("https://api.deepseek.com/")).toBe("https://api.deepseek.com/chat/completions");
    expect(normalizeEndpoint("http://localhost:11434/custom")).toBe("http://localhost:11434/custom");
    expect(normalizeEndpoint("  ")).toBe("");
  });
});

describe("kindFromStatus", () => {
  it("maps HTTP statuses", () => {
    expect(kindFromStatus(0)).toBe("network");
    expect(kindFromStatus(401)).toBe("auth");
    expect(kindFromStatus(429)).toBe("rateLimit");
    expect(kindFromStatus(400)).toBe("badRequest");
    expect(kindFromStatus(404)).toBe("notFound");
    expect(kindFromStatus(503)).toBe("server");
    expect(kindFromStatus(504)).toBe("timeout");
  });
});
