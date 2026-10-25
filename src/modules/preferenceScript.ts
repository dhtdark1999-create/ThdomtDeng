import { config } from "../../package.json";
import { normalizeEndpoint } from "./ai/client";

export async function registerPrefsScripts(_window: Window) {
  if (!addon.data.prefs) {
    addon.data.prefs = {
      window: _window,
      columns: [],
      rows: [],
    };
  } else {
    addon.data.prefs.window = _window;
  }
  bindEndpointPreview(_window.document);
}

/**
 * Show the URL requests will actually go to, updating as the user types.
 * Uses the same normalizeEndpoint() as the client so the preview can't drift.
 */
function bindEndpointPreview(doc: Document) {
  const input = doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-endpoint`,
  ) as HTMLInputElement | null;
  const preview = doc.querySelector(
    `#zotero-prefpane-${config.addonRef}-endpoint-preview`,
  ) as HTMLElement | null;
  if (!input || !preview) {
    Zotero.debug("[ZoteroAIReader] Endpoint preview elements not found");
    return;
  }

  const update = () => {
    const url = normalizeEndpoint(input.value);
    if (url) {
      doc.l10n?.setAttributes(preview, `${config.addonRef}-pref-endpoint-preview`, { url });
    } else {
      doc.l10n?.setAttributes(preview, `${config.addonRef}-pref-endpoint-preview-empty`);
    }
  };

  input.addEventListener("input", update);
  // Fired by Zotero when the field is filled from the stored pref
  input.addEventListener("syncfrompreference", update);
  update();
}
