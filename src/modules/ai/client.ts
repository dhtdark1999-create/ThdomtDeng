export interface AIConfig {
  endpoint: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export class AIClient {
  private config: AIConfig | null = null;

  constructor() {}

  public loadConfig(): AIConfig | null {
    const endpoint = Zotero.Prefs.get(`${addon.data.config.prefsPrefix}.endpoint`) as string;
    const apiKey = Zotero.Prefs.get(`${addon.data.config.prefsPrefix}.apiKey`) as string;
    const model = Zotero.Prefs.get(`${addon.data.config.prefsPrefix}.model`) as string;
    const systemPrompt = Zotero.Prefs.get(`${addon.data.config.prefsPrefix}.systemPrompt`) as string;

    if (!endpoint || !apiKey) {
      Zotero.debug("[ZoteroAIReader] AI config not set");
      return null;
    }

    this.config = { endpoint, apiKey, model: model || "gpt-4", systemPrompt: systemPrompt || "" };
    return this.config;
  }

  public isConfigured(): boolean {
    return this.loadConfig() !== null;
  }

  public async chat(messages: Message[]): Promise<string> {
    const config = this.loadConfig();
    if (!config) {
      throw new Error("AI not configured");
    }

    try {
      const response = await Zotero.HTTP.request("POST", config.endpoint, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (response.status !== 200) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = JSON.parse(response.response);
      return data.choices?.[0]?.message?.content || "";
    } catch (error) {
      Zotero.debug("[ZoteroAIReader] Chat error: " + String(error));
      throw error;
    }
  }

  public async chatStream(
    messages: Message[],
    onChunk: (chunk: string) => void,
  ): Promise<string> {
    // For Zotero 8, we use a simplified approach
    // Full streaming would require using fetch API directly with proper CORS handling
    const fullContent = await this.chat(messages);

    // Simulate streaming for better UX
    const chunks = fullContent.split(/(\s+)/);
    let result = "";
    for (const chunk of chunks) {
      result += chunk;
      onChunk(chunk);
      await Zotero.Promise.delay(10); // Small delay for visual effect
    }
    return result;
  }
}
