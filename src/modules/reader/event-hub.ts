import type { PaperContext } from "../ai/prompts";

export interface Selection {
  /** Regular (parent) item ID the selection belongs to */
  itemID: number;
  text: string;
}

type SelectionListener = (sel: Selection) => void;
type PopupHandler = _ZoteroTypes.Reader.EventHandler<"renderTextSelectionPopup">;

export class ReaderEventHub {
  private static instance: ReaderEventHub;
  private selection: Selection | null = null;
  private listeners = new Set<SelectionListener>();
  private popupHandler: PopupHandler | null = null;
  /** Called to decorate the reader's text selection popup with buttons */
  public popupDecorator:
    | ((doc: Document, append: (...n: Node[]) => void, sel: Selection) => void)
    | null = null;

  private constructor() {}

  public static getInstance(): ReaderEventHub {
    if (!ReaderEventHub.instance) {
      ReaderEventHub.instance = new ReaderEventHub();
    }
    return ReaderEventHub.instance;
  }

  public registerEvents(): void {
    Zotero.debug("[ZoteroAIReader] Registering reader events");
    this.unregisterEvents();

    // Fired by Zotero's reader whenever the user selects text in a PDF/EPUB/snapshot.
    // The text comes from the reader's internal text layer, which is reliable
    // across the nested PDF.js iframe (unlike DOM selectionchange).
    this.popupHandler = (event) => {
      const { reader, doc, params, append } = event;
      const text = (params.annotation?.text || "").trim();
      const itemID = ReaderEventHub.regularItemIDForReader(reader);
      if (!text || itemID === null) return;

      const sel = { itemID, text };
      this.setSelection(sel);
      this.popupDecorator?.(doc, append as (...n: Node[]) => void, sel);
    };
    Zotero.Reader.registerEventListener(
      "renderTextSelectionPopup",
      this.popupHandler,
      addon.data.config.addonID,
    );
  }

  public unregisterEvents(): void {
    if (this.popupHandler) {
      Zotero.Reader.unregisterEventListener("renderTextSelectionPopup", this.popupHandler);
      this.popupHandler = null;
    }
    this.listeners.clear();
    this.selection = null;
  }

  public onSelection(fn: SelectionListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Latest selection for an item, or "" if the last selection was elsewhere. */
  public getSelectedText(itemID: number): string {
    return this.selection?.itemID === itemID ? this.selection.text : "";
  }

  public setSelection(sel: Selection): void {
    this.selection = sel;
    const preview = sel.text.length > 50 ? sel.text.substring(0, 50) + "..." : sel.text;
    Zotero.debug("[ZoteroAIReader] Selected text updated: " + preview);
    for (const fn of this.listeners) {
      try {
        fn(sel);
      } catch (e) {
        Zotero.debug("[ZoteroAIReader] Selection listener error: " + String(e));
      }
    }
  }

  /** Map a reader to the regular item that owns its attachment. */
  public static regularItemIDForReader(reader: _ZoteroTypes.ReaderInstance): number | null {
    const attachment = reader.itemID ? Zotero.Items.get(reader.itemID) : reader._item;
    if (!attachment) return null;
    return ReaderEventHub.regularItem(attachment).id;
  }

  /** The item whose metadata describes the document (parent of an attachment). */
  public static regularItem(item: Zotero.Item): Zotero.Item {
    if (item.isAttachment?.() && item.parentItem) return item.parentItem;
    return item;
  }

  public static getPaperContext(item: Zotero.Item | null): PaperContext | null {
    if (!item) return null;
    try {
      const regular = ReaderEventHub.regularItem(item);
      const tags = regular.getTags?.()?.map((t: any) => (typeof t === "string" ? t : t.tag)) || [];
      const creators = regular.getCreators?.() || [];
      const authors = creators
        .map((c: any) => (c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.lastName || ""))
        .filter(Boolean);
      // getField returns "" for fields not valid for the item type
      return {
        title: (regular.getField("title") as string) || "",
        abstract: (regular.getField("abstractNote") as string) || "",
        itemType: regular.itemType || "",
        tags,
        authors,
      };
    } catch (error) {
      Zotero.debug("[ZoteroAIReader] Error getting item metadata: " + String(error));
      return null;
    }
  }
}
