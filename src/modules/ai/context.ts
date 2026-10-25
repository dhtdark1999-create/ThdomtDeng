import { estimateTokens } from "../../utils/token-counter";
import type { ChatMessage } from "./prompts";

export interface ContextBlock {
  content: string;
  tokenCount: number;
  pageNumber?: number;
  timestamp: number;
}

export class ContextManager {
  private maxTokens: number;
  private blocks: ContextBlock[] = [];
  private systemPrompt: string = "";

  constructor(maxTokens: number = 6000) {
    this.maxTokens = maxTokens;
  }

  public setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
  }

  public addBlock(content: string, pageNumber?: number): void {
    const tokenCount = this.estimateTokens(content);
    this.blocks.push({
      content,
      tokenCount,
      pageNumber,
      timestamp: Date.now(),
    });
    this.prune();
  }

  public getMessages(): ChatMessage[] {
    const messages: ChatMessage[] = [];

    if (this.systemPrompt) {
      messages.push({
        role: "system",
        content: this.systemPrompt,
      });
    }

    for (const block of this.blocks) {
      messages.push({
        role: "user",
        content: block.content,
      });
    }

    return messages;
  }

  public clear(): void {
    this.blocks = [];
  }

  public get totalTokens(): number {
    let total = 0;
    if (this.systemPrompt) {
      total += this.estimateTokens(this.systemPrompt);
    }
    for (const block of this.blocks) {
      total += block.tokenCount;
    }
    return total;
  }

  private prune(): void {
    while (this.totalTokens > this.maxTokens && this.blocks.length > 1) {
      this.blocks.shift();
    }
  }

  private estimateTokens(text: string): number {
    return estimateTokens(text);
  }
}
