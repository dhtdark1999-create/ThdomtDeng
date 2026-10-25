// @vitest-environment happy-dom
/* eslint-disable no-restricted-globals -- tests use happy-dom's document directly */
import { describe, expect, it, vi } from "vitest";

(globalThis as any).Zotero = { debug: () => {} };
(globalThis as any).addon = { data: {} };

const { registerPrefsScripts } = await import("../src/modules/preferenceScript");

describe("endpoint preview", () => {
  it("shows the normalized URL and follows edits", async () => {
    document.body.innerHTML = `
      <input id="zotero-prefpane-zoteroAIR-endpoint" value="https://api.deepseek.com">
      <div id="zotero-prefpane-zoteroAIR-endpoint-preview"></div>`;
    const setAttributes = vi.fn();
    (document as any).l10n = { setAttributes };

    await registerPrefsScripts(window as unknown as Window);
    const preview = document.getElementById("zotero-prefpane-zoteroAIR-endpoint-preview");
    expect(setAttributes).toHaveBeenLastCalledWith(preview, "zoteroAIR-pref-endpoint-preview", {
      url: "https://api.deepseek.com/chat/completions",
    });

    const input = document.getElementById("zotero-prefpane-zoteroAIR-endpoint") as HTMLInputElement;
    input.value = "https://api.openai.com/v1/";
    input.dispatchEvent(new Event("input"));
    expect(setAttributes).toHaveBeenLastCalledWith(preview, "zoteroAIR-pref-endpoint-preview", {
      url: "https://api.openai.com/v1/chat/completions",
    });

    input.value = "  ";
    input.dispatchEvent(new Event("input"));
    expect(setAttributes).toHaveBeenLastCalledWith(preview, "zoteroAIR-pref-endpoint-preview-empty");
  });
});
