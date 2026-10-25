# Zotero AI Reader

English | [简体中文](doc/README-zhCN.md)

An AI reading assistant for Zotero. Select text in a PDF and translate it, explain it, or ask questions about the paper in a sidebar next to the reader. Works with any OpenAI-compatible API (DeepSeek, OpenAI, local servers, proxies).

## Features

- **Sidebar in the reader.** Open a PDF and click the chat-bubble icon in the right-hand column. The sidebar shows the paper's title and authors.
- **Act on selected text.** Selecting text adds **AI Translate** and **AI Explain** buttons to Zotero's selection popup. The sidebar quotes the selection and offers **Translate**, **Explain** and **Summarize**. With nothing selected, **Summarize** summarizes the paper from its title and abstract.
- **Ask questions.** Type in the input box. Enter sends, Shift+Enter adds a new line.
- **Streaming replies.** Answers appear as they are generated. You can stop a reply, clear the conversation, or copy an answer.
- **Paper context.** Every request includes the paper's title, authors, tags and abstract. Earlier turns of the conversation are included until the token limit you set is reached.
- **Auto mode.** When enabled, every new selection is translated automatically.
- **Readable errors.** A wrong key, rate limit, bad endpoint or network failure each get their own message, along with the error text the server returned.

Conversations are kept per paper while Zotero is running. They are not saved across restarts.

## Requirements

- Zotero 8, 9 or 10 (tested on Zotero 10.0.6 for Windows)
- An API key for an OpenAI-compatible chat completions service

## Installation

1. Download `zotero-ai-reader.xpi` from the [Releases](../../releases) page if one is published, or build it yourself (see [Development](#development)).
2. In Zotero, open **Tools → Plugins**, click the gear icon, and choose **Install Plugin From File…**. You can also drag the `.xpi` onto the Plugins window.
3. Open **Edit → Settings** (**Zotero → Settings** on macOS) and fill in the **Zotero AI Reader** pane.

When upgrading from a build older than 2026-10-25, restart Zotero once before installing the new version. Older builds failed to clean up on uninstall, which left the settings pane blank.

## Settings

| Setting              | Description                                                                            |
| -------------------- | -------------------------------------------------------------------------------------- |
| Endpoint             | Your provider's API address. See the rules below.                                      |
| API Key              | Sent as `Authorization: Bearer <key>`.                                                 |
| Model                | Sent to the provider exactly as typed.                                                 |
| Answer language      | Language used for translations and answers. Default: 简体中文.                         |
| Max context tokens   | Upper limit for paper context plus conversation history in one request. Default: 6000. |
| System prompt        | Optional. Replaces the built-in instructions. Paper context is still appended.         |
| Auto mode            | Translate each new selection automatically.                                            |
| Show sidebar on left | Not implemented yet. Has no effect.                                                    |

### Endpoint

The URL that requests will actually go to is shown below the field and updates as you type. The plugin completes the address as follows:

| You enter                                 | Requests go to                                     |
| ----------------------------------------- | -------------------------------------------------- |
| `https://api.deepseek.com`                | `https://api.deepseek.com/chat/completions`        |
| `https://api.openai.com/v1`               | `https://api.openai.com/v1/chat/completions`       |
| `https://example.com/api/paas/v4`         | `https://example.com/api/paas/v4/chat/completions` |
| `https://example.com/v1/chat/completions` | unchanged                                          |
| `http://localhost:8080/my/proxy`          | unchanged                                          |

In other words, `/chat/completions` is appended to a bare host or a path ending in a version number (`/v1`, `/v4`, …). Any other address is used as is.

## Privacy

- The selected text, the paper's title, authors, tags and abstract, and the conversation are sent to the endpoint you configure. Nothing is sent anywhere else.
- The API key is stored unencrypted in Zotero's `prefs.js` in your profile folder.

## Not implemented yet

- Using the paper's full text as context. Only the abstract is sent today.
- Saving a conversation as a Zotero note.
- Keyboard shortcuts.
- Moving the sidebar to the left.
- Keeping conversations after Zotero restarts.

## Development

Requires Node.js 20 or later.

```bash
npm install
npm run build      # outputs .scaffold/build/zotero-ai-reader.xpi
npm test           # unit tests (vitest)
npm run test:e2e   # end-to-end test in a real Zotero
npm start          # dev mode with hot reload; set up .env from .env.example first
```

`npm run test:e2e` launches Zotero with a temporary profile and data directory, the built XPI, a test harness plugin and a local mock API server. Your own Zotero profile, library and API key are not touched. It checks the settings pane, the reader sidebar, the selection popup, streaming replies, error handling, reinstalling over a running copy, and disable/enable. Set `ZOTERO_BIN` if Zotero is not at `D:/programs/zotero.exe`.

Main source files:

| Path                               | Purpose                                                         |
| ---------------------------------- | --------------------------------------------------------------- |
| `src/modules/ai/client.ts`         | HTTP request and streaming (SSE), endpoint completion           |
| `src/modules/ai/chat-session.ts`   | Per-paper conversation and history trimming                     |
| `src/modules/ai/prompts.ts`        | Prompts for each action and paper context                       |
| `src/modules/ui/sidebar-view.ts`   | Sidebar UI                                                      |
| `src/modules/ui/reader-sidebar.ts` | Sidebar registration and selection popup buttons                |
| `src/modules/reader/event-hub.ts`  | Text selection events and paper metadata                        |
| `src/modules/preferenceScript.ts`  | Settings pane script (endpoint preview)                         |
| `addon/`                           | Manifest, bootstrap, settings pane markup, styles, translations |

Built with [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template) and [zotero-plugin-toolkit](https://github.com/windingwind/zotero-plugin-toolkit).

## License

[AGPL-3.0-or-later](LICENSE)
