import { estimateTokens } from "../../utils/token-counter";

export type ChatAction = "translate" | "explain" | "summarize" | "ask";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface PaperContext {
  title: string;
  abstract: string;
  authors: string[];
  tags: string[];
  itemType: string;
}

export const DEFAULT_SYSTEM_PROMPT =
  "You are a reading assistant embedded in Zotero. Help the user understand " +
  "the document they are reading. Be accurate and concise, and say so when " +
  "the provided context is not enough to answer.";

const MAX_ABSTRACT_CHARS = 1500;

/** System prompt = user/default prompt + paper background. */
export function buildSystemPrompt(
  customPrompt: string,
  paper: PaperContext | null,
): string {
  const parts = [customPrompt.trim() || DEFAULT_SYSTEM_PROMPT];
  if (paper && (paper.title || paper.abstract)) {
    const lines = ["", "Background on the document being read:"];
    if (paper.title) lines.push(`Title: ${paper.title}`);
    if (paper.authors.length) lines.push(`Authors: ${paper.authors.join(", ")}`);
    if (paper.tags.length) lines.push(`Tags: ${paper.tags.join(", ")}`);
    if (paper.abstract) {
      const abs =
        paper.abstract.length > MAX_ABSTRACT_CHARS
          ? paper.abstract.substring(0, MAX_ABSTRACT_CHARS) + "..."
          : paper.abstract;
      lines.push(`Abstract: ${abs}`);
    }
    parts.push(lines.join("\n"));
  }
  return parts.join("\n");
}

/**
 * Build the user message for a quick action.
 * @param text selected text (or free-form question for "ask")
 * @param targetLanguage language for translations/answers, e.g. "简体中文"
 */
export function buildActionPrompt(
  action: ChatAction,
  text: string,
  targetLanguage: string,
  paper: PaperContext | null = null,
): string {
  const lang = targetLanguage.trim() || "English";
  switch (action) {
    case "translate":
      return (
        `Translate the following text into ${lang}. ` +
        "Output only the translation, preserving formulas, citations and terminology.\n\n" +
        text
      );
    case "explain":
      return (
        `Explain the following passage in ${lang}: its meaning, key terms, ` +
        "and how it relates to the rest of the paper if the background helps.\n\n" +
        text
      );
    case "summarize":
      if (text) {
        return `Summarize the following passage in ${lang} as a few bullet points.\n\n${text}`;
      }
      return (
        `Summarize this paper in ${lang} based on its title and abstract: ` +
        "research question, method, main findings.\n\n" +
        `Title: ${paper?.title || "(unknown)"}\nAbstract: ${paper?.abstract || "(none)"}`
      );
    case "ask":
    default:
      return text;
  }
}

/**
 * Keep the system prompt and as many of the most recent messages as fit in
 * `maxTokens`. The latest message is always kept even if it alone exceeds
 * the budget, so the user's question is never silently dropped.
 */
export function fitToBudget(
  system: string,
  history: ChatMessage[],
  maxTokens: number,
): ChatMessage[] {
  let used = estimateTokens(system);
  const kept: ChatMessage[] = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const cost = estimateTokens(history[i].content);
    if (kept.length > 0 && used + cost > maxTokens) break;
    used += cost;
    kept.unshift(history[i]);
  }
  // Don't open the window on a dangling assistant reply
  while (kept.length > 1 && kept[0].role === "assistant") kept.shift();
  return system ? [{ role: "system", content: system }, ...kept] : kept;
}
