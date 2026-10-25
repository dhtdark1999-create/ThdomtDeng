import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// getString() only reads addon.ftl, so every key it is called with must live there.
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? sourceFiles(p) : p.endsWith(".ts") ? [p] : [];
  });
}

function ftlKeys(path: string): Set<string> {
  const keys = new Set<string>();
  for (const line of readFileSync(path, "utf-8").split(/\r?\n/)) {
    const m = /^([a-zA-Z][\w-]*)\s*=/.exec(line);
    if (m) keys.add(m[1]);
  }
  return keys;
}

const src = sourceFiles("src")
  .map((f) => readFileSync(f, "utf-8"))
  .join("\n")
  // Drop block comments, which contain getString() usage examples
  .replace(/\/\*[\s\S]*?\*\//g, "");
const literalKeys = [...src.matchAll(/getString\(\s*"([\w-]+)"/g)].map((m) => m[1]);
// Keys built from template literals in the code
const dynamicKeys = [
  ...["translate", "explain", "summarize"].map((a) => `action-${a}`),
  ...["translate", "explain"].map((a) => `popup-${a}`),
  ...["config", "auth", "rateLimit", "network", "timeout", "server", "badRequest", "aborted", "unknown"].map(
    (k) => `error-${k}`,
  ),
];

describe.each(["en-US", "zh-CN"])("addon.ftl (%s)", (locale) => {
  const keys = ftlKeys(`addon/locale/${locale}/addon.ftl`);
  it("defines every key passed to getString", () => {
    const missing = [...new Set([...literalKeys, ...dynamicKeys])].filter((k) => !keys.has(k));
    expect(missing).toEqual([]);
  });
});
