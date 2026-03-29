export class ReaderEventHub {
  private static instance: ReaderEventHub;
  private selectedText: string = "";
  private currentItem: Zotero.Item | null = null;
  private _selectionCleanup: (() => void) | null = null;
  private _lastSelectedText: string = "";

  private constructor() {}

  public static getInstance(): ReaderEventHub {
    if (!ReaderEventHub.instance) {
      ReaderEventHub.instance = new ReaderEventHub();
    }
    return ReaderEventHub.instance;
  }

  public registerEvents(): void {
    Zotero.debug("[ZoteroAIReader] Registering reader events");
    this._cleanup(); // Clean up any existing listeners

    // Register for text selection popup events
    this.registerTextSelectionPopup();

    // Register reader events
    this.registerReaderEvents();
  }

  private registerTextSelectionPopup(): void {
    // Listen for text selection in the reader
    const handleTextSelection = (event: any) => {
      Zotero.debug("[ZoteroAIReader] Text selection event");
    };

    // This would be implemented based on Zotero 8's reader API
    // For now, we'll use the section's onRender to capture selection
    Zotero.debug("[ZoteroAIReader] Text selection handler registered");
  }

  private registerReaderEvents(): void {
    // Register for reader tab changes
    Zotero.Notifier.registerObserver(
      {
        notify: async (
          event: string,
          type: string,
          ids: Array<string | number>,
          extraData: { [key: string]: any },
        ) => {
          if (event === "select" && type === "tab" && extraData[ids[0]]?.type === "reader") {
            await this.onReaderOpen(extraData[ids[0]]);
          }
        },
      },
      ["tab"],
      "zotero-ai-reader",
    );
  }

  private async onReaderOpen(readerInfo: any): Promise<void> {
    Zotero.debug("[ZoteroAIReader] Reader opened");
    // Get the current reader and its item
    try {
      const reader = await this.getCurrentReader();
      if (reader) {
        this.currentItem = await this.getItemForReader(reader);
        Zotero.debug("[ZoteroAIReader] Current item set");
      }
    } catch (error) {
      Zotero.debug("[ZoteroAIReader] Error getting reader");
    }
  }

  private async getCurrentReader(): Promise<any | null> {
    const mainWindow = Zotero.getMainWindow();
    if (!mainWindow) return null;

    const reader = mainWindow.ZoteroReader?.getCurrentReader?.();
    return reader || null;
  }

  private async getItemForReader(reader: any): Promise<Zotero.Item | null> {
    try {
      const itemID = await reader._itemID;
      if (itemID) {
        return await Zotero.Items.getAsync(itemID) as Zotero.Item;
      }
    } catch (error) {
      Zotero.debug("[ZoteroAIReader] Error getting item for reader");
    }
    return null;
  }

  public getSelectedText(): string {
    return this.selectedText;
  }

  public setSelectedText(text: string): void {
    this.selectedText = text;
    const preview = text.length > 50 ? text.substring(0, 50) + "..." : text;
    Zotero.debug("[ZoteroAIReader] Selected text updated: " + preview);
  }

  public registerSelectionListener(reader: any): void {
    // Cleanup existing listener first
    this._cleanup();

    const iframe = reader._iframe?.contentDocument;
    if (!iframe) {
      Zotero.debug("[ZoteroAIReader] iframe not ready for selection listener");
      return;
    }

    const handler = () => {
      const selection = reader._iframe?.contentWindow?.getSelection();
      const text = selection?.toString()?.trim() || "";
      if (text !== this._lastSelectedText) {
        this._lastSelectedText = text;
        this.setSelectedText(text);
        Zotero.debug("[ZoteroAIReader] Selection changed: " + (text.length > 50 ? text.substring(0, 50) + "..." : text));
      }
    };

    iframe.addEventListener("selectionchange", handler);

    this._selectionCleanup = () => {
      iframe.removeEventListener("selectionchange", handler);
      Zotero.debug("[ZoteroAIReader] Selection listener cleaned up");
    };

    Zotero.debug("[ZoteroAIReader] Selection listener registered");
  }

  private _cleanup(): void {
    if (this._selectionCleanup) {
      this._selectionCleanup();
      this._selectionCleanup = null;
    }
  }

  public getCurrentItem(): Zotero.Item | null {
    return this.currentItem;
  }

  public async getItemMetadata(): Promise<{ title: string; abstract: string; itemType: string } | null> {
    if (!this.currentItem) return null;

    try {
      return {
        title: this.currentItem.getField("title") as string,
        abstract: (this.currentItem.getField("abstractNote") as string) || "",
        itemType: this.currentItem.itemType,
      };
    } catch (error) {
      Zotero.debug("[ZoteroAIReader] Error getting item metadata");
      return null;
    }
  }
}
