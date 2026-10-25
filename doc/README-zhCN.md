# Zotero AI 阅读助手

[English](../README.md) | 简体中文

一款 Zotero 的 AI 阅读插件。在 PDF 中选中文本后，可以在阅读器旁的侧边栏里翻译、解释，或者就论文内容提问。支持任意 OpenAI 兼容的 API（DeepSeek、OpenAI、本地服务、代理等）。

## 功能

- **阅读器侧边栏**：打开 PDF，点右侧竖排图标中的对话气泡图标即可打开。侧边栏顶部显示论文标题和作者。
- **划词操作**：选中文本后，Zotero 的选区弹窗里会多出「AI 翻译」「AI 解释」两个按钮。侧边栏会显示选中的原文，并提供「翻译」「解释」「总结」按钮。没有选中文本时，「总结」会根据论文标题和摘要总结整篇论文。
- **自由提问**：在输入框里输入问题，Enter 发送，Shift+Enter 换行。
- **流式回复**：回答边生成边显示，可以随时停止、清空对话或复制回答。
- **论文上下文**：每次请求都会带上论文的标题、作者、标签和摘要，并在不超过你设定的 Token 上限的前提下带上之前的对话。
- **自动模式**：开启后，每次划词都会自动翻译。
- **清楚的错误提示**：密钥错误、请求过于频繁、端点地址错误、网络故障分别有各自的提示，并附上服务器返回的原始报错。

对话按论文分别保存，只在 Zotero 运行期间有效，重启后不保留。

## 环境要求

- Zotero 8、9 或 10（已在 Windows 版 Zotero 10.0.6 上测试）
- 一个 OpenAI 兼容对话接口的 API 密钥

## 安装

1. 从 [Releases](../../../releases) 页面下载 `zotero-ai-reader.xpi`（如有发布），或者自行构建（见[开发](#开发)）。
2. 在 Zotero 中打开「工具 → 插件」，点右上角齿轮图标，选择从文件安装的那一项。也可以把 `.xpi` 直接拖进插件窗口。
3. 打开「编辑 → 设置」（macOS 上为「Zotero → 设置」），在「Zotero AI 阅读助手」页面填写配置。

如果是从 2026-10-25 之前的版本升级，请先完全退出并重启一次 Zotero 再安装新版。旧版本卸载时清理不干净，会导致设置页空白。

## 设置项

| 设置              | 说明                                                   |
| ----------------- | ------------------------------------------------------ |
| 端点地址          | 服务商的 API 地址，补全规则见下文。                    |
| API 密钥          | 以 `Authorization: Bearer <密钥>` 的形式发送。         |
| 模型              | 按你填写的内容原样发给服务商。                         |
| 回答语言          | 翻译和回答使用的语言，默认「简体中文」。               |
| 上下文 Token 上限 | 单次请求中论文信息加对话历史的上限，默认 6000。        |
| 系统提示词        | 可选。填写后替换内置的提示词，论文信息仍会附加在后面。 |
| 自动模式          | 每次划词自动翻译。                                     |
| 在左侧显示侧边栏  | 尚未实现，目前不起作用。                               |

### 端点地址

输入框下方会实时显示「实际请求地址」，随输入更新。补全规则如下：

| 填写                                      | 实际请求地址                                       |
| ----------------------------------------- | -------------------------------------------------- |
| `https://api.deepseek.com`                | `https://api.deepseek.com/chat/completions`        |
| `https://api.openai.com/v1`               | `https://api.openai.com/v1/chat/completions`       |
| `https://example.com/api/paas/v4`         | `https://example.com/api/paas/v4/chat/completions` |
| `https://example.com/v1/chat/completions` | 不变                                               |
| `http://localhost:8080/my/proxy`          | 不变                                               |

也就是说：只填域名，或路径以版本号（`/v1`、`/v4` 等）结尾时，会补上 `/chat/completions`；其他地址按原样使用。

## 隐私

- 选中的文本、论文的标题、作者、标签和摘要，以及对话内容，只会发送到你配置的端点，不会发往其他地方。
- API 密钥以明文保存在 Zotero 配置目录的 `prefs.js` 中。

## 尚未实现

- 以论文全文作为上下文（目前只发送摘要）
- 把对话保存为 Zotero 笔记
- 快捷键
- 侧边栏移到左侧
- 重启 Zotero 后保留对话

## 开发

需要 Node.js 20 或更高版本。

```bash
npm install
npm run build      # 生成 .scaffold/build/zotero-ai-reader.xpi
npm test           # 单元测试（vitest）
npm run test:e2e   # 在真实 Zotero 中运行端到端测试
npm start          # 热重载开发模式，需先参照 .env.example 配置 .env
```

`npm run test:e2e` 会用临时的配置目录和数据目录启动 Zotero，装入构建好的 XPI、一个测试用插件和一个本地模拟 API 服务。不会改动你自己的 Zotero 配置、文献库，也不会使用你的 API 密钥。测试内容包括：设置页、阅读器侧边栏、选区弹窗、流式回复、错误处理、在运行中覆盖安装，以及禁用与重新启用。如果 Zotero 不在 `D:/programs/zotero.exe`，请设置环境变量 `ZOTERO_BIN`。

主要源码：

| 路径                               | 作用                                     |
| ---------------------------------- | ---------------------------------------- |
| `src/modules/ai/client.ts`         | HTTP 请求与流式（SSE）解析、端点补全     |
| `src/modules/ai/chat-session.ts`   | 按论文保存对话、裁剪历史                 |
| `src/modules/ai/prompts.ts`        | 各操作的提示词与论文上下文               |
| `src/modules/ui/sidebar-view.ts`   | 侧边栏界面                               |
| `src/modules/ui/reader-sidebar.ts` | 侧边栏注册、选区弹窗按钮                 |
| `src/modules/reader/event-hub.ts`  | 划词事件与论文元数据                     |
| `src/modules/preferenceScript.ts`  | 设置页脚本（端点预览）                   |
| `addon/`                           | 清单、启动脚本、设置页、样式、多语言文本 |

基于 [zotero-plugin-template](https://github.com/windingwind/zotero-plugin-template) 和 [zotero-plugin-toolkit](https://github.com/windingwind/zotero-plugin-toolkit) 构建。

## 许可证

[AGPL-3.0-or-later](../LICENSE)
