import { describe, expect, it } from "vitest";
import { extractErrorMessage, SSEParser } from "../src/modules/ai/sse";

const chunk = (content: string) =>
  `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;

describe("SSEParser", () => {
  it("parses complete events", () => {
    const p = new SSEParser();
    expect(p.feed(chunk("Hel") + chunk("lo"))).toEqual(["Hel", "lo"]);
  });

  it("buffers a line split across feeds", () => {
    const p = new SSEParser();
    const whole = chunk("split");
    expect(p.feed(whole.substring(0, 15))).toEqual([]);
    expect(p.feed(whole.substring(15))).toEqual(["split"]);
  });

  it("only parses new text when fed accumulated responses", () => {
    const p = new SSEParser();
    const a = chunk("a");
    const ab = a + chunk("b");
    expect(p.feedAccumulated(a)).toEqual(["a"]);
    expect(p.feedAccumulated(ab)).toEqual(["b"]);
    expect(p.feedAccumulated(ab)).toEqual([]);
  });

  it("handles CRLF, comments, role-only chunks and [DONE]", () => {
    const p = new SSEParser();
    const role = `data: ${JSON.stringify({ choices: [{ delta: { role: "assistant" } }] })}\r\n\r\n`;
    const out = p.feed(": keep-alive\r\n" + role + chunk("x").replace(/\n/g, "\r\n") + "data: [DONE]\r\n");
    expect(out).toEqual(["x"]);
    expect(p.done).toBe(true);
  });

  it("flushes a final line without trailing newline", () => {
    const p = new SSEParser();
    expect(p.feed(chunk("end").trimEnd())).toEqual([]);
    expect(p.flush()).toEqual(["end"]);
  });

  it("ignores malformed JSON", () => {
    const p = new SSEParser();
    expect(p.feed("data: {not json\n" + chunk("ok"))).toEqual(["ok"]);
  });
});

describe("extractErrorMessage", () => {
  it("reads OpenAI-style errors", () => {
    expect(extractErrorMessage('{"error":{"message":"Invalid key"}}')).toBe("Invalid key");
    expect(extractErrorMessage('{"error":"nope"}')).toBe("nope");
  });

  it("falls back to truncated raw text", () => {
    expect(extractErrorMessage("Bad Gateway")).toBe("Bad Gateway");
    expect(extractErrorMessage("x".repeat(300))).toHaveLength(203);
    expect(extractErrorMessage("")).toBe("");
  });
});
