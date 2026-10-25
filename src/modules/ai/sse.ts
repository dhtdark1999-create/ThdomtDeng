/**
 * Incremental parser for OpenAI-compatible Server-Sent Events streams.
 *
 * XHR `onprogress` hands us the whole accumulated response text each time,
 * so the parser tracks how far it has already consumed and only parses the
 * new tail. Incomplete trailing lines are kept until the next feed.
 */
export class SSEParser {
  private consumed = 0;
  private buffer = "";
  private _done = false;

  /** True once a `data: [DONE]` sentinel has been seen. */
  public get done(): boolean {
    return this._done;
  }

  /**
   * Feed the full accumulated response text.
   * @returns content deltas found since the previous call
   */
  public feedAccumulated(fullText: string): string[] {
    const fresh = fullText.substring(this.consumed);
    this.consumed = fullText.length;
    return this.feed(fresh);
  }

  /**
   * Feed a new chunk of text.
   * @returns content deltas contained in the completed lines
   */
  public feed(chunk: string): string[] {
    this.buffer += chunk;
    const lines = this.buffer.split(/\r?\n/);
    // Last element is either "" (chunk ended on newline) or a partial line
    this.buffer = lines.pop() ?? "";
    return this.parseLines(lines);
  }

  /** Flush any trailing line that arrived without a final newline. */
  public flush(): string[] {
    const rest = this.buffer;
    this.buffer = "";
    return rest ? this.parseLines([rest]) : [];
  }

  private parseLines(lines: string[]): string[] {
    const deltas: string[] = [];
    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.substring(5).trim();
      if (!payload) continue;
      if (payload === "[DONE]") {
        this._done = true;
        continue;
      }
      const delta = extractDelta(payload);
      if (delta) deltas.push(delta);
    }
    return deltas;
  }
}

function extractDelta(payload: string): string {
  try {
    const json = JSON.parse(payload);
    const choice = json?.choices?.[0];
    // Streaming chunks use `delta`; some proxies send full `message` objects
    return choice?.delta?.content ?? choice?.message?.content ?? "";
  } catch {
    return "";
  }
}

/**
 * Pull a human-readable error message out of an API error body, if any.
 * Handles `{"error": {"message": ...}}` and `{"error": "..."}` shapes.
 */
export function extractErrorMessage(body: string): string {
  if (!body) return "";
  try {
    const json = JSON.parse(body);
    const err = json?.error;
    if (typeof err === "string") return err;
    if (typeof err?.message === "string") return err.message;
    if (typeof json?.message === "string") return json.message;
  } catch {
    // Not JSON; fall through to raw text
  }
  return body.length > 200 ? body.substring(0, 200) + "..." : body;
}
