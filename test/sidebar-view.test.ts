// @vitest-environment happy-dom
/* eslint-disable no-restricted-globals -- tests use happy-dom's document directly */
import { beforeEach, describe, expect, it, vi } from "vitest";

const prefs: Record<string, unknown> = {};

// Minimal Zotero/addon globals the view touches
(globalThis as any).Zotero = {
  debug: () => {},
  logError: (e: unknown) => console.error(e),
  Prefs: { get: (k: string) => prefs[k.split(".").pop()!] },
  Items: { get: () => null },
  Utilities: { Internal: { copyTextToClipboard: vi.fn(), openPreferences: vi.fn() } },
  Reader: { registerEventListener: vi.fn(), unregisterEventListener: vi.fn() },
};
(globalThis as any).addon = {
  data: {
    config: { addonRef: "zoteroAIR", addonID: "test@example.com" },
    locale: {
      current: {
        // Echo the message ID so tests can assert on keys
        formatMessagesSync: (ids: Array<{ id: string }>) => ids.map(({ id }) => ({ value: id })),
      },
    },
  },
};

const { SessionStore } = await import("../src/modules/ai/chat-session");
const { SidebarView } = await import("../src/modules/ui/sidebar-view");

function fakeItem(over: Partial<Record<string, any>> = {}) {
  return {
    id: 42,
    itemType: "journalArticle",
    isAttachment: () => false,
    parentItem: null,
    getField: (f: string) => ({ title: "A Paper", abstractNote: "Abstract." } as any)[f] ?? "",
    getTags: () => [{ tag: "t1" }],
    getCreators: () => [{ firstName: "Ada", lastName: "Lovelace" }],
    ...over,
  } as unknown as Zotero.Item;
}

describe("SidebarView", () => {
  beforeEach(() => {
    SessionStore.reset();
    SessionStore.init({
      loadConfig: () => {
        throw new Error("unused");
      },
      streamChat: () => {
        throw new Error("unused");
      },
    } as any);
    document.body.replaceChildren();
  });

  it("renders metadata and placeholder after bind", () => {
    const body = document.createElement("div");
    document.body.appendChild(body);
    const view = new SidebarView(body, "ai-reader-sidebar");
    view.bind(fakeItem());

    expect(body.querySelector(".air-title")?.textContent).toBe("A Paper");
    expect(body.querySelector(".air-authors")?.textContent).toBe("Ada Lovelace");
    expect(body.querySelector(".air-placeholder")?.textContent).toBe("zoteroAIR-reader-sidebar-placeholder");
    expect(body.querySelectorAll(".air-actions button")).toHaveLength(3);
  });

  it("binds an attachment to its parent item", () => {
    const parent = fakeItem();
    const attachment = fakeItem({ id: 7, isAttachment: () => true, parentItem: parent });
    const body = document.createElement("div");
    document.body.appendChild(body);
    const view = new SidebarView(body, "p");
    view.bind(attachment);
    expect(SidebarView.forItem(42)).toBe(view);
  });

  it("shows the config hint when no API key is set", () => {
    const body = document.createElement("div");
    document.body.appendChild(body);
    new SidebarView(body, "p").bind(fakeItem());
    const hint = body.querySelector(".air-hint") as HTMLElement;
    expect(hint.hidden).toBe(false);
    expect(hint.textContent).toContain("zoteroAIR-error-config");
  });
});

describe("ReaderSidebarFactory hooks", () => {
  it("binds the item even when Zotero skips onRender after re-init", async () => {
    let options: any;
    (globalThis as any).Zotero.ItemPaneManager = {
      registerSection: (o: any) => ((options = o), "key"),
      unregisterSection: vi.fn(),
    };
    const { ReaderSidebarFactory } = await import("../src/modules/ui/reader-sidebar");
    ReaderSidebarFactory.registerReaderSidebar();

    // Pane re-attached: Zotero calls init with a fresh body, then itemChange,
    // but considers the render already done and never calls onRender.
    const body = document.createElement("div");
    document.body.appendChild(body);
    const item = fakeItem();
    options.onInit({ body, item: undefined });
    options.onItemChange({ body, item, tabType: "reader", setEnabled: vi.fn() });

    expect(body.querySelector(".air-title")?.textContent).toBe("A Paper");
    ReaderSidebarFactory.unregisterReaderSidebar();
  });
});
