import { getLocaleID, getString } from "../../utils/locale";
import { ReaderEventHub } from "../reader/event-hub";

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export class ReaderSidebarFactory {
  private static buildMetadataHtml(metadata: {
    title: string;
    abstract: string;
    tags: string[];
    authors: string[];
  } | null): string {
    if (!metadata) return "";
    const tagsHtml = metadata.tags.length > 0
      ? `<div class="ai-reader-tags">${metadata.tags.slice(0, 5).map((t: string) =>
          `<span class="ai-reader-tag">${escapeHtml(t)}</span>`
        ).join("")}</div>`
      : "";
    const authorsHtml = metadata.authors.length > 0
      ? `<div class="ai-reader-authors">${escapeHtml(metadata.authors.join(", "))}</div>`
      : "";
    return `
      <div class="ai-reader-metadata">
        <div class="ai-reader-title">${escapeHtml(metadata.title || "Untitled")}</div>
        ${authorsHtml}
        ${tagsHtml}
        ${metadata.abstract ? `<div class="ai-reader-abstract">${escapeHtml(metadata.abstract.substring(0, 200))}${metadata.abstract.length > 200 ? "..." : ""}</div>` : ""}
      </div>
    `;
  }

  private static buildSelectionHtml(selectedText: string): string {
    if (selectedText) {
      return `<div class="ai-reader-selection">
        <div class="ai-reader-selection-label">Selected Text:</div>
        <blockquote class="ai-reader-selection-text">${escapeHtml(selectedText)}</blockquote>
      </div>`;
    }
    return `<div class="ai-reader-placeholder">${getString("reader-sidebar-placeholder")}</div>`;
  }

  public static registerReaderSidebar() {
    Zotero.ItemPaneManager.registerSection({
      paneID: "ai-reader-sidebar",
      pluginID: addon.data.config.addonID,
      header: {
        l10nID: getLocaleID("reader-sidebar-header"),
        icon: "chrome://zotero/skin/16/universal/quickSearch.svg",
      },
      sidenav: {
        l10nID: getLocaleID("reader-sidebar-sidenav-tooltip"),
        icon: "chrome://zotero/skin/20/universal/quickSearch.svg",
      },
      onInit: ({ item }) => {
        Zotero.debug("[ZoteroAIReader] Reader sidebar initialized");
      },
      onItemChange: ({ item, setEnabled, tabType }) => {
        setEnabled(tabType === "reader");
        return true;
      },
      onRender: async ({ body, item, setL10nArgs, setSectionSummary }) => {
        Zotero.debug("[ZoteroAIReader] Reader sidebar rendering");
        const eventHub = ReaderEventHub.getInstance();
        const selectedText = eventHub.getSelectedText();
        let metadata = null;
        try {
          metadata = await eventHub.getItemMetadata();
        } catch (e) {
          Zotero.debug("[ZoteroAIReader] Failed to get metadata: " + String(e));
        }
        setL10nArgs(`{ "status": "ready" }`);
        body.innerHTML = `
          <div id="ai-reader-container" style="padding: 12px; height: 100%; display: flex; flex-direction: column; gap: 12px;">
            ${ReaderSidebarFactory.buildMetadataHtml(metadata)}
            ${ReaderSidebarFactory.buildSelectionHtml(selectedText)}
          </div>
          <style>
            .ai-reader-metadata { border-bottom: 1px solid #eee; padding-bottom: 12px; }
            .ai-reader-title { font-weight: 600; font-size: 14px; color: #333; margin-bottom: 4px; }
            .ai-reader-authors { font-size: 12px; color: #666; margin-bottom: 4px; }
            .ai-reader-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
            .ai-reader-tag { background: #e8f0fe; color: #1a73e8; padding: 2px 8px; border-radius: 12px; font-size: 11px; }
            .ai-reader-abstract { font-size: 12px; color: #666; line-height: 1.4; margin-top: 8px; }
            .ai-reader-selection-label { font-size: 11px; color: #999; text-transform: uppercase; margin-bottom: 6px; }
            .ai-reader-selection-text { margin: 0; padding: 8px 12px; background: #f8f9fa; border-left: 3px solid #1a73e8; font-size: 13px; line-height: 1.5; color: #333; }
            .ai-reader-placeholder { color: #999; font-style: italic; font-size: 13px; text-align: center; padding: 20px 0; }
          </style>
        `;
        setSectionSummary(selectedText
          ? (selectedText.length > 30 ? selectedText.substring(0, 30) + "..." : selectedText)
          : "AI Reader Ready");
      },
      onToggle: async ({ item }) => {
        Zotero.debug("[ZoteroAIReader] Reader sidebar toggled");
        // Re-register selection listener when sidebar becomes visible
        const eventHub = ReaderEventHub.getInstance();
        const reader = await addon.data.ztoolkit.Reader.getReader();
        if (reader) {
          eventHub.registerSelectionListener(reader);
        }
      },
    });
  }
}
