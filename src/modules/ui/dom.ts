const HTML_NS = "http://www.w3.org/1999/xhtml";

type Attrs = Record<string, string | boolean | undefined>;

/**
 * Create an HTML element in `doc`. Always uses the XHTML namespace so it
 * works in both the XUL main window and the reader iframes. Text children
 * are added as text nodes, never parsed as HTML.
 */
export function h<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
  attrs: Attrs = {},
  children: Array<Node | string | null | undefined> = [],
): HTMLElementTagNameMap[K] {
  const el = doc.createElementNS(HTML_NS, tag) as HTMLElementTagNameMap[K];
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children) {
    if (c === null || c === undefined) continue;
    el.append(typeof c === "string" ? doc.createTextNode(c) : c);
  }
  return el;
}

export function truncate(text: string, max: number): string {
  return text.length > max ? text.substring(0, max) + "…" : text;
}
