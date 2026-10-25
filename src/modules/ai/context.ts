import { Message } from "./client";

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

  public getMessages(): Message[] {
    const messages: Message[] = [];

    if (this.systemPrompt) {
      messages.push({
        role: "system",
        content: this.systemPrompt,
        timestamp: 0,
      });
    }

    for (const block of this.blocks) {
      messages.push({
        role: "user",
        content: block.content,
        timestamp: block.timestamp,
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
    // Rough estimation: ~4 characters per token for English, fewer for other languages
    // This is a simplified version; for production, use a proper tokenizer
    return Math.ceil(text.length / 4);
  }
}
