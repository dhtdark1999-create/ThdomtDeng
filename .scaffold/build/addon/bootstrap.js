/* eslint-disable no-undef */

/**
 * Bootstrap entry point for Zotero AI Reader plugin.
 * Compatible with Zotero 7, 8, and 9.
 *
 * References:
 * [1] https://www.zotero.org/support/dev/zotero_7_for_developers
 * [2] https://www.zotero.org/support/dev/zotero_8_for_developers
 * [3] https://github.com/zotero/make-it-red (official sample)
 */

var chromeHandle;

function install(data, reason) {}

async function startup({ id, version, resourceURI, rootURI }, reason) {
  await Zotero.initializationPromise;

  // String 'rootURI' introduced in Zotero 7; fallback for older versions
  if (!rootURI) {
    rootURI = resourceURI.spec;
  }

  // Zotero 7+ (Firefox/Gecko >= 102): use runtime chrome registration via manifest
  // Zotero 8/9 (Gecko >= 128/140) still supports this API
  if (Zotero.platformMajorVersion >= 102) {
    var aomStartup = Components.classes[
      "@mozilla.org/addons/addon-manager-startup;1"
    ].getService(Components.interfaces.amIAddonManagerStartup);
    var manifestURI = Services.io.newURI(rootURI + "manifest.json");
    chromeHandle = aomStartup.registerChrome(manifestURI, [
      ["content", "zoteroAIR", rootURI + "content/"],
    ]);
  }

  /**
   * Global sandbox context for plugin scripts.
   * _globalThis is globally accessible within the plugin sandbox.
   * See src/index.ts for details.
   */
  const ctx = {
    rootURI,
  };
  ctx._globalThis = ctx;

  Services.scriptloader.loadSubScript(
    rootURI + "content/scripts/zoteroAIR.js",
    ctx,
  );
  Zotero.ZoteroAIR.hooks.onStartup();
}

async function onMainWindowLoad({ window }, reason) {
  Zotero.ZoteroAIR?.hooks.onMainWindowLoad(window);
}

async function onMainWindowUnload({ window }, reason) {
  Zotero.ZoteroAIR?.hooks.onMainWindowUnload(window);
}

function shutdown({ id, version, resourceURI, rootURI }, reason) {
  if (reason === APP_SHUTDOWN) {
    return;
  }

  if (typeof Zotero === "undefined") {
    Zotero = Components.classes["@zotero.org/Zotero;1"].getService(
      Components.interfaces.nsISupports,
    ).wrappedJSObject;
  }

  Zotero.ZoteroAIR?.hooks.onShutdown();

  // nsIStringBundleService.flushBundles() clears locale caches
  try {
    Cc["@mozilla.org/intl/stringbundle;1"]
      .getService(Components.interfaces.nsIStringBundleService)
      .flushBundles();
  } catch (e) {
    // May not be available in all versions
  }

  // Cu.unload was removed in Firefox 140 (Zotero 8+)
  if (typeof Cu !== "undefined" && typeof Cu.unload === "function") {
    try {
      Cu.unload(rootURI + "content/scripts/zoteroAIR.js");
    } catch (e) {
      // Ignore unload errors
    }
  }

  if (chromeHandle) {
    chromeHandle.destruct();
    chromeHandle = null;
  }
}

function uninstall(data, reason) {}
