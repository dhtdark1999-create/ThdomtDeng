/**
 * Minimal Markdown support for AI replies. Parses into a small AST that is
 * rendered with DOM APIs, so model output is never interpreted as HTML.
 *
 * Supported: paragraphs, #-headings, -/* and 1. lists, ``` code fences,
 * > quotes, inline `code`, **bold**, *italic*.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "code"; v: string }
  | { t: "strong"; c: Inline[] }
  | { t: "em"; c: Inline[] };

export type Block =
  | { t: "p"; c: Inline[] }
  | { t: "h"; level: number; c: Inline[] }
  | { t: "ul" | "ol"; items: Inline[][] }
  | { t: "pre"; v: string }
  | { t: "quote"; c: Inline[] };

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) blocks.push({ t: "p", c: parseInline(para.join("\n")) });
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^\s*```/.test(line)) {
      flushPara();
      const code: string[] = [];
      i++;
      // An unterminated fence (still streaming) runs to the end
      while (i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++]);
      blocks.push({ t: "pre", v: code.join("\n") });
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushPara();
      blocks.push({ t: "h", level: heading[1].length, c: parseInline(heading[2]) });
      continue;
    }

    const listRe = /^\s*([-*+]|\d+[.)])\s+(.*)$/;
    const item = listRe.exec(line);
    if (item) {
      flushPara();
      const kind = /\d/.test(item[1]) ? "ol" : "ul";
      const items: Inline[][] = [parseInline(item[2])];
      while (i + 1 < lines.length) {
        const next = listRe.exec(lines[i + 1]);
        if (!next || (/\d/.test(next[1]) ? "ol" : "ul") !== kind) break;
        items.push(parseInline(next[2]));
        i++;
      }
      blocks.push({ t: kind, items });
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(line);
    if (quote) {
      flushPara();
      blocks.push({ t: "quote", c: parseInline(quote[1]) });
      continue;
    }

    if (!line.trim()) flushPara();
    else para.push(line);
  }
  flushPara();
  return blocks;
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  const re = /`([^`\n]+)`|\*\*([^*\n]+?)\*\*|\*([^*\s][^*\n]*?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ t: "text", v: src.substring(last, m.index) });
    if (m[1] !== undefined) out.push({ t: "code", v: m[1] });
    else if (m[2] !== undefined) out.push({ t: "strong", c: parseInline(m[2]) });
    else out.push({ t: "em", c: parseInline(m[3]) });
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ t: "text", v: src.substring(last) });
  return out;
}

const HTML_NS = "http://www.w3.org/1999/xhtml";

export function renderMarkdown(doc: Document, src: string): DocumentFragment {
  const frag = doc.createDocumentFragment();
  const el = (tag: string) => doc.createElementNS(HTML_NS, tag) as HTMLElement;

  const inline = (parent: Node, nodes: Inline[]) => {
    for (const n of nodes) {
      if (n.t === "text") {
        // Keep single newlines inside a paragraph as line breaks
        n.v.split("\n").forEach((part, idx) => {
          if (idx > 0) parent.appendChild(el("br"));
          if (part) parent.appendChild(doc.createTextNode(part));
        });
      } else if (n.t === "code") {
        const c = el("code");
        c.textContent = n.v;
        parent.appendChild(c);
      } else {
        const w = el(n.t);
        inline(w, n.c);
        parent.appendChild(w);
      }
    }
  };

  for (const b of parseMarkdown(src)) {
    let node: HTMLElement;
    switch (b.t) {
      case "p":
        node = el("p");
        inline(node, b.c);
        break;
      case "h":
        // Keep headings small inside a narrow sidebar
        node = el(b.level <= 2 ? "h4" : "h5");
        inline(node, b.c);
        break;
      case "ul":
      case "ol":
        node = el(b.t);
        for (const it of b.items) {
          const li = el("li");
          inline(li, it);
          node.appendChild(li);
        }
        break;
      case "pre": {
        node = el("pre");
        const code = el("code");
        code.textContent = b.v;
        node.appendChild(code);
        break;
      }
      case "quote":
        node = el("blockquote");
        inline(node, b.c);
        break;
    }
    frag.appendChild(node);
  }
  return frag;
}
