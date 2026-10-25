/* eslint-disable no-undef */
/**
 * E2E harness: a throwaway plugin loaded next to Zotero AI Reader in an
 * isolated profile. It drives the real Zotero UI, records pass/fail checks,
 * writes them to the file named by the `zair.e2e.out` pref, then quits.
 */

const PLUGIN_ID = "zotero-ai-reader@claude.ai";
const results = [];
const consoleErrors = [];
let consoleListener = null;

function check(name, ok, detail = "") {
  results.push({ name, ok: !!ok, detail: String(detail) });
  Zotero.debug(`[ZAIR-E2E] ${ok ? "PASS" : "FAIL"} ${name} ${detail}`);
  return !!ok;
}

async function waitFor(fn, timeout, label) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeout) {
    try {
      last = await fn();
      if (last) return last;
    } catch (e) {
      last = e;
    }
    await Zotero.Promise.delay(200);
  }
  throw new Error(`Timed out waiting for ${label}` + (last instanceof Error ? `: ${last}` : ""));
}

async function step(name, fn) {
  try {
    await fn();
  } catch (e) {
    check(name, false, `${e}\n${e?.stack || ""}`);
  }
}

function pref(name) {
  return Services.prefs.getStringPref(name, "");
}

function setPluginPref(key, value) {
  Zotero.Prefs.set(`extensions.zotero.zoteroAIR.${key}`, value, true);
}

async function fetchResource(win, uri) {
  const r = await win.fetch(uri);
  const size = (await r.arrayBuffer()).byteLength;
  return { ok: r.ok, size };
}

function startConsoleCapture() {
  consoleListener = {
    observe(msg) {
      try {
        const text = `${msg.sourceName || ""} ${msg.message || msg}`;
        if (/zoteroAIR|ai-reader|zotero-ai-reader/i.test(text)) consoleErrors.push(text.slice(0, 1000));
      } catch {
        // ignore
      }
    },
    QueryInterface: ChromeUtils.generateQI(["nsIConsoleListener"]),
  };
  Services.console.registerListener(consoleListener);
}

async function testPreferences(addon) {
  const paneID = addon.data.prefPaneID;
  const pane = Zotero.PreferencePanes.pluginPanes.find((p) => p.id === paneID);
  if (!check("pref pane is in Zotero.PreferencePanes", pane, paneID)) return;

  const main = Zotero.getMainWindow();
  for (const [label, uri] of [["icon", pane.image], ["markup", pane.src]]) {
    const r = await fetchResource(main, uri).catch((e) => ({ ok: false, size: 0, error: String(e) }));
    check(`pref pane ${label} loads`, r.ok && r.size > 0, `${uri} -> ${JSON.stringify(r)}`);
  }

  const pw = Zotero.Utilities.Internal.openPreferences(paneID);
  await waitFor(() => pw.Zotero_Preferences?.panes?.get(paneID), 20000, "prefs window");
  await waitFor(() => pw.Zotero_Preferences.panes.get(paneID).loaded, 20000, "pane load");
  check("pref pane loads in the preferences window", true);

  const doc = pw.document;
  const item = doc.querySelector(`richlistitem[value="${paneID}"]`);
  const img = item?.querySelector("image");
  check("pref pane has a navigation entry with an icon", img?.src, img?.src || "no image element");
  if (img) {
    // XUL <image> exposes no load state; measure the rendered box instead
    await Zotero.Promise.delay(500);
    const rect = img.getBoundingClientRect();
    check("pref pane icon renders with a size", rect.width > 0 && rect.height > 0, `${rect.width}x${rect.height}`);
  }

  const input = doc.getElementById("zotero-prefpane-zoteroAIR-endpoint");
  const preview = doc.getElementById("zotero-prefpane-zoteroAIR-endpoint-preview");
  if (!check("endpoint input and preview exist", input && preview)) return;
  check("endpoint input shows the stored pref", input.value === Zotero.Prefs.get("extensions.zotero.zoteroAIR.endpoint", true), input.value);

  input.value = "https://api.deepseek.com";
  input.dispatchEvent(new pw.Event("input"));
  const text = await waitFor(
    () => (preview.textContent.includes("https://api.deepseek.com/chat/completions") ? preview.textContent : ""),
    5000,
    "endpoint preview text",
  ).catch((e) => String(e));
  check("endpoint preview shows the request URL", text.includes("https://api.deepseek.com/chat/completions"), text);
  pw.close();
}

/** Install the XPI again over the running copy, as a user does when updating. */
async function testReinstall(oldPaneID) {
  const { AddonManager } = ChromeUtils.importESModule("resource://gre/modules/AddonManager.sys.mjs");
  const file = Zotero.File.pathToFile(pref("zair.e2e.xpi"));
  const install = await AddonManager.getInstallForFile(file);
  await install.install();
  const addon = await waitFor(
    () => Zotero.ZoteroAIR?.data?.prefPaneID && Zotero.ZoteroAIR.data.prefPaneID !== oldPaneID && Zotero.ZoteroAIR,
    30000,
    "plugin restart after reinstall",
  );
  check("plugin restarts after reinstall", true, addon.data.prefPaneID);
  const panes = Zotero.PreferencePanes.pluginPanes.filter((p) => p.pluginID === PLUGIN_ID);
  check("exactly one pref pane after reinstall", panes.length === 1, panes.map((p) => p.id).join(", "));
  for (const name of ["favicon.png", "sidenav-20.svg"]) {
    const uri = `chrome://zoteroAIR/content/icons/${name}`;
    const r = await fetchResource(Zotero.getMainWindow(), uri).catch((e) => ({ ok: false, error: String(e) }));
    check(`after reinstall: ${name} loads`, r.ok && r.size > 0, `${uri} -> ${JSON.stringify(r)}`);
  }
  // Re-run the settings checks against the reinstalled plugin
  const before = results.length;
  await testPreferences(addon);
  for (const r of results.slice(before)) r.name = `after reinstall: ${r.name}`;
}

/** Disabling must shut down cleanly and release the chrome:// registration. */
async function testDisable() {
  const { AddonManager } = ChromeUtils.importESModule("resource://gre/modules/AddonManager.sys.mjs");
  const errorsBefore = consoleErrors.length;
  const a = await AddonManager.getAddonByID(PLUGIN_ID);
  await a.disable();
  await waitFor(() => !Zotero.ZoteroAIR, 10000, "plugin instance removed");
  const shutdownErrors = consoleErrors.slice(errorsBefore);
  check("disable runs shutdown without errors", shutdownErrors.length === 0, shutdownErrors.join(" || "));
  const r = await fetchResource(Zotero.getMainWindow(), "chrome://zoteroAIR/content/icons/favicon.png").catch(() => ({ ok: false }));
  check("chrome:// registration released on disable", !r.ok, JSON.stringify(r));
  // The probe above is expected to log "No chrome package registered"
  await Zotero.Promise.delay(200);
  for (let i = consoleErrors.length - 1; i >= errorsBefore; i--) {
    if (/No chrome package registered/.test(consoleErrors[i])) consoleErrors.splice(i, 1);
  }
  const panes = Zotero.PreferencePanes.pluginPanes.filter((p) => p.pluginID === PLUGIN_ID);
  check("pref pane removed on disable", panes.length === 0, panes.length);
  await a.enable();
  await waitFor(() => Zotero.ZoteroAIR?.data?.prefPaneID, 30000, "plugin restart after enable");
  check("plugin starts again after enable", true);
}

async function makePaper() {
  const item = new Zotero.Item("journalArticle");
  item.setField("title", "E2E Paper");
  item.setField("abstractNote", "An abstract used by the end-to-end test.");
  item.setCreators([{ firstName: "Ada", lastName: "Lovelace", creatorType: "author" }]);
  await item.saveTx();
  const att = await Zotero.Attachments.importFromFile({ file: pref("zair.e2e.pdf"), parentItemID: item.id });
  return { item, att };
}

function findSection(win) {
  return [...win.document.querySelectorAll("item-pane-custom-section")].find(
    (el) => String(el.paneID || "").includes("ai-reader-sidebar") && el.closest("#zotero-context-pane"),
  );
}

async function testSidebar() {
  const win = Zotero.getMainWindow();
  const { att } = await makePaper();
  const reader = await Zotero.Reader.open(att.id);
  await reader._initPromise;
  await waitFor(() => reader._iframeWindow?.document?.readyState === "complete", 20000, "reader iframe");
  if (win.ZoteroContextPane?.collapsed) win.ZoteroContextPane.collapsed = false;

  const section = await waitFor(() => findSection(win), 20000, "AI Reader section in reader tab");
  check("sidebar section exists in the reader tab", section);
  const title = await waitFor(() => section.querySelector(".air-title")?.textContent, 10000, "sidebar title").catch(
    (e) => String(e),
  );
  check("sidebar shows the paper title", title === "E2E Paper", title);

  // Simulate a text selection through the reader's own event pipeline
  const mock = pref("zair.e2e.mock");
  setPluginPref("endpoint", `${mock}/v1`);
  setPluginPref("apiKey", "test-key");
  setPluginPref("model", "mock-model");
  setPluginPref("autoMode", false);
  const popup = reader._iframeWindow.document.createElement("div");
  Zotero.Reader._dispatchEvent({
    type: "renderTextSelectionPopup",
    reader,
    doc: reader._iframeWindow.document,
    params: { annotation: { text: "Hello world" } },
    append: (...nodes) => popup.append(...nodes),
  });
  const buttons = [...popup.querySelectorAll("button")];
  check("selection popup gets AI buttons", buttons.length === 2, buttons.map((b) => b.textContent).join(" | "));
  const quote = section.querySelector(".air-quote");
  check("sidebar quotes the selection", quote && !quote.hidden && quote.textContent === "Hello world", quote?.textContent);

  // Translate via the popup button and watch the reply stream in
  const updates = [];
  const log = section.querySelector(".air-log");
  const observer = new win.MutationObserver(() => {
    const b = log.querySelector(".air-assistant:last-of-type");
    if (b) updates.push(b.textContent);
  });
  observer.observe(log, { childList: true, subtree: true, characterData: true });
  buttons[0].click();
  const reply = await waitFor(
    () => {
      const b = [...log.querySelectorAll(".air-assistant")].pop();
      return b && !b.classList.contains("air-streaming") && b;
    },
    30000,
    "translation reply",
  );
  observer.disconnect();
  check("translation reply arrives", !reply.classList.contains("air-error"), reply.textContent);
  check("reply text matches the streamed chunks", reply.textContent.startsWith("你好，世界"), reply.textContent);
  const partial = new Set(updates.filter((t) => t && !t.startsWith("你好，世界")));
  check("reply rendered incrementally (streaming)", partial.size >= 1, [...partial].join(" | "));

  // Wrong key: the mock answers 401
  setPluginPref("apiKey", "wrong-key");
  section.querySelectorAll(".air-actions button")[1].click();
  const failed = await waitFor(
    () => {
      const b = [...log.querySelectorAll(".air-assistant")].pop();
      return b && b !== reply && b.classList.contains("air-error") && b;
    },
    30000,
    "auth error",
  ).catch((e) => String(e));
  const errText = typeof failed === "string" ? failed : failed.textContent;
  check("401 shows the auth error with server detail", /401/.test(errText) && /mock/i.test(errText), errText);
}

async function run() {
  startConsoleCapture();
  await Zotero.uiReadyPromise;
  const addon = await waitFor(() => Zotero.ZoteroAIR?.data?.prefPaneID && Zotero.ZoteroAIR, 30000, "plugin startup");
  check("plugin started and registered a pref pane", true, addon.data.prefPaneID);

  await step("preferences", () => testPreferences(addon));
  await step("sidebar", () => testSidebar());
  await step("reinstall", () => testReinstall(addon.data.prefPaneID));
  await step("disable", () => testDisable());
}

async function main() {
  const out = pref("zair.e2e.out");
  try {
    await run();
  } catch (e) {
    check("harness", false, `${e}\n${e?.stack || ""}`);
  }
  if (consoleListener) Services.console.unregisterListener(consoleListener);
  try {
    await Zotero.File.putContentsAsync(out, JSON.stringify({ results, consoleErrors }, null, 2));
  } catch (e) {
    Zotero.debug(`[ZAIR-E2E] Failed to write results to ${out}: ${e}`);
  }
  Services.startup.quit(Ci.nsIAppStartup.eForceQuit);
}

function startup() {
  // Zotero awaits each plugin's startup() in turn, so don't block it:
  // the plugin under test only starts after this returns.
  Zotero.initializationPromise.then(() => main());
}

function shutdown() {}
function install() {}
function uninstall() {}
