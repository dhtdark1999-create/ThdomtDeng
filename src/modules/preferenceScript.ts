import { config } from "../../package.json";

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
  updatePrefsUI();
}

async function updatePrefsUI() {
  Zotero.debug("[ZoteroAIReader] Preference UI updated");
}

export function bindPrefEvents() {
  // API endpoint
  const endpoint = addon.data.prefs?.window.document.querySelector(
    `#zotero-prefpane-${config.addonRef}-endpoint`,
  );
  if (endpoint) {
    endpoint.addEventListener("change", (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      Zotero.Prefs.set(`${config.prefsPrefix}.endpoint`, value, true);
      Zotero.debug("[ZoteroAIReader] Endpoint updated");
    });
  }

  // API Key
  const apiKey = addon.data.prefs?.window.document.querySelector(
    `#zotero-prefpane-${config.addonRef}-apiKey`,
  );
  if (apiKey) {
    apiKey.addEventListener("change", (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      Zotero.Prefs.set(`${config.prefsPrefix}.apiKey`, value, true);
      Zotero.debug("[ZoteroAIReader] API Key updated");
    });
  }

  // Model
  const model = addon.data.prefs?.window.document.querySelector(
    `#zotero-prefpane-${config.addonRef}-model`,
  );
  if (model) {
    model.addEventListener("change", (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      Zotero.Prefs.set(`${config.prefsPrefix}.model`, value, true);
      Zotero.debug("[ZoteroAIReader] Model updated");
    });
  }

  // System Prompt
  const systemPrompt = addon.data.prefs?.window.document.querySelector(
    `#zotero-prefpane-${config.addonRef}-systemPrompt`,
  );
  if (systemPrompt) {
    systemPrompt.addEventListener("change", (e: Event) => {
      const value = (e.target as HTMLTextAreaElement).value;
      Zotero.Prefs.set(`${config.prefsPrefix}.systemPrompt`, value, true);
      Zotero.debug("[ZoteroAIReader] System prompt updated");
    });
  }
}
