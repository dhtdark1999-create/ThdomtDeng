import { config } from "../package.json";
import { ColumnOptions, DialogHelper } from "zotero-plugin-toolkit";
import { ReaderSidebarFactory } from "./modules/ui/reader-sidebar";
import { AIClient } from "./modules/ai/client";
import { SessionStore } from "./modules/ai/chat-session";
import { ReaderEventHub } from "./modules/reader/event-hub";
import { getString, initLocale } from "./utils/locale";
import { createZToolkit } from "./utils/ztoolkit";

class Addon {
  public data: {
    alive: boolean;
    config: typeof config;
    env: "development" | "production";
    ztoolkit: ZToolkit;
    locale?: {
      current: any;
    };
    prefs?: {
      window: Window;
      columns: Array<ColumnOptions>;
      rows: Array<{ [dataKey: string]: string }>;
    };
    dialog?: DialogHelper;
    prefPaneID?: string;
  };

  public hooks: {
    onStartup: () => Promise<void>;
    onShutdown: () => void;
    onMainWindowLoad: (win: Window) => Promise<void>;
    onMainWindowUnload: (win: Window) => Promise<void>;
    onNotify: (event: string, type: string, ids: Array<string | number>, extraData: { [key: string]: any }) => Promise<void>;
    onPrefsEvent: (type: string, data: { [key: string]: any }) => Promise<void>;
  };

  constructor() {
    this.data = {
      alive: true,
      config,
      env: __env__,
      ztoolkit: createZToolkit(),
    };
    this.hooks = {
      onStartup,
      onShutdown,
      onMainWindowLoad,
      onMainWindowUnload,
      onNotify,
      onPrefsEvent,
    };
  }
}

export default Addon;

// Hook implementations
async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  Zotero.debug("[ZoteroAIReader] Plugin starting up...");

  initLocale();

  addon.data.prefPaneID = await Zotero.PreferencePanes.register({
    pluginID: addon.data.config.addonID,
    src: rootURI + "content/preferences.xhtml",
    label: getString("prefs-title"),
    image: `chrome://${addon.data.config.addonRef}/content/icons/favicon.png`,
  });

  SessionStore.init(new AIClient());

  // Register the reader sidebar panel
  ReaderSidebarFactory.registerReaderSidebar();
  Zotero.debug("[ZoteroAIReader] Reader sidebar registered");

  // Register reader events
  ReaderEventHub.getInstance().registerEvents();
  Zotero.debug("[ZoteroAIReader] Reader events registered");

  // Show startup notification
  new ztoolkit.ProgressWindow(addon.data.config.addonName, {
    closeOnClick: true,
    closeTime: 3000,
  })
    .createLine({
      text: getString("startup-finish"),
      type: "success",
      progress: 100 as any,
    })
    .show();

  await Promise.all(
    Zotero.getMainWindows().map((win) => onMainWindowLoad(win)),
  );
}

async function onMainWindowLoad(win: Window): Promise<void> {
  addon.data.ztoolkit = createZToolkit();

  // @ts-ignore This is a moz feature
  win.MozXULElement.insertFTLIfNeeded(
    `${addon.data.config.addonRef}-mainWindow.ftl`,
  );

  Zotero.debug("[ZoteroAIReader] Main window loaded");
}

async function onMainWindowUnload(win: Window): Promise<void> {
  ztoolkit.unregisterAll();
}

function onShutdown(): void {
  SessionStore.reset();
  ReaderEventHub.getInstance().unregisterEvents();
  ReaderSidebarFactory.unregisterReaderSidebar();
  ztoolkit.unregisterAll();
  addon.data.alive = false;
  // @ts-ignore - Plugin instance is not typed
  delete Zotero[addon.data.config.addonInstance];
  Zotero.debug("[ZoteroAIReader] Plugin shutdown complete");
}

async function onNotify(
  event: string,
  type: string,
  ids: Array<string | number>,
  extraData: { [key: string]: any },
) {
  Zotero.debug("[ZoteroAIReader] Notification received");
}

async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  switch (type) {
    case "load": {
      const prefs = await import("./modules/preferenceScript");
      prefs.registerPrefsScripts(data.window);
      break;
    }
    default:
      return;
  }
}
