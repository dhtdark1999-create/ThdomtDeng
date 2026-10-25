// CJK ideographs, kana and hangul tend to be ~1 token per character,
// while Latin text averages ~4 characters per token.
const CJK_RE = /[぀-ヿ㐀-䶿一-鿿가-힯豈-﫿]/g;

/** Rough token estimate without a tokenizer (no WASM in the plugin sandbox). */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  const cjk = text.match(CJK_RE)?.length ?? 0;
  const other = text.length - cjk;
  return cjk + Math.ceil(other / 4);
}
