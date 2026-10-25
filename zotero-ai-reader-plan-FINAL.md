# Zotero AI 阅读助手插件 — 终极开发计划

## 背景与目标

为 Zotero 8（基于 Firefox 140 ESR）开发一款 AI 辅助阅读插件。

### 核心功能
- 固定侧边栏（位置可切换），随页面滚动或鼠标划词实时响应
- 划词触发翻译和解释
- 自动/手动模式可选
- 基于语义切片的跨页上下文对话
- 用户自定义 API 配置（通过 Zotero 原生设置面板）

### 远期扩展（V2+）
- 机器心理学实验基座：预设 Prompt 模型观察 AI 心理模型
- 一键转笔记：将 AI 对话保存为 Zotero Child Note

---

## 技术选型

| 类别 | 选择 | 理由 |
|------|------|------|
| **基础脚手架** | `zotero-plugin-template` | 原生 ESM + Vite，Zotero 8 最佳起点 |
| **核心工具库** | `zotero-plugin-toolkit` | 封装 UI 注入和偏好设置，降低试错成本 |
| **UI 架构** | HTML Custom Elements + Fluent (.ftl) | Zotero 8 官方推荐，摆脱 XUL 约束 |
| **API 调用** | 原生 `fetch` + SSE（优先）| 现代 Web 标准，流式渲染完美 |
| **API 降级** | `Zotero.HTTP.request` | fetch 不可用时的 fallback |
| **配置管理** | **Zotero 原生 Preference Pane** | 可视化配置，用户友好，避免 config.json 出错 |
| **Token 计算** | 字符估算法 | 避免 WASM 包体积和沙箱限制 |

### Zotero 8 关键技术提醒

- **JSM → ESM**：所有 `.jsm` 迁移为 `.mjs`/`sys.mjs`，使用 `import`/`export`
- **Bluebird 移除**：改用原生 `async/await` + 标准 Promise
- **全局 import 不再支持**：导入必须赋值给变量
- **Preference Pane 作用域隔离**：共享变量需显式挂到 `window`
- **新菜单 API**：`Zotero.MenuManager.registerMenu()` 替代 DOM 注入
- **可用 `migrate-fx140` 脚本**批量迁移 JSM/Bluebird 代码

---

## 项目结构

```
zotero-ai-reader/
├── src/
│   ├── index.ts                      # 插件入口：使用 Toolkit 初始化
│   ├── addon.ts                      # 主 Addon 类：生命周期与模块挂载
│   ├── modules/
│   │   ├── ui/
│   │   │   ├── reader-sidebar.ts    # 阅读器侧边栏（核心交互区）
│   │   │   └── preferences.ts       # 设置面板（API Key、Endpoint、System Prompt）
│   │   ├── reader/
│   │   │   ├── event-hub.ts         # 划词/翻页事件监听 + PDF 元数据提取
│   │   │   └── annotator.ts         # AI 对话转 Zotero 笔记（V2 功能）
│   │   └── ai/
│   │       ├── client.ts            # AI 调用：fetch + SSE 流式解析
│   │       └── context.ts           # 上下文：语义切片 + 滑动窗口裁剪
│   ├── elements/
│   │   ├── sidebar-panel.ts         # 侧边栏面板 Custom Element
│   │   ├── chat-input.ts            # 对话输入框组件
│   │   ├── chat-messages.ts         # 消息气泡列表组件
│   │   └── text-selection-popup.ts  # 划词弹出菜单（备选）
│   └── utils/
│       ├── i18n.ts                   # 国际化（Fluent .ftl）
│       └── token-counter.ts         # 轻量 Token 估算
├── addon/
│   ├── manifest.json                 # 插件清单：strict_min_version: "8.0"
│   ├── bootstrap.js                 # 生命周期（ESM 导入方式）
│   ├── prefs.js                     # 默认偏好设置
│   ├── locale/
│   │   └── zh-CN/addon.ftl          # 国际化资源
│   └── chrome/
│       └── icons/                   # 图标资源
├── package.json
├── zotero-plugin.config.ts
└── tsconfig.json
```

---

## 开发阶段

### 阶段 1：项目搭建（1-2 天）

**目标**：跑通 Zotero 8 插件开发工作流，渲染基础侧边栏

- [ ] 使用 `zotero-plugin-template` 初始化项目，引入 `zotero-plugin-toolkit`
- [ ] 配置 `manifest.json`（`strict_min_version: "8.0"`）
- [ ] 实现 `bootstrap.js`（ESM 导入方式）
- [ ] 使用 Toolkit 的 Reader API 在 PDF 阅读器挂载空白侧边栏面板
- [ ] 搭建原生 Preference Pane 骨架
- [ ] 注册 chrome 资源（`aomStartup.registerChrome`）
- [ ] `Zotero.debug()` 输出初始化日志

**里程碑**：npm build 成功 → Zotero 8 加载插件 → 右侧显示空白侧边栏 + 首选项中有配置页

---

### 阶段 2：PDF 阅读器集成（2-3 天）

**目标**：捕获 PDF 文本选择事件，提取论文元数据

- [ ] 注册 `renderTextSelectionPopup` 事件监听
- [ ] 获取选中文本内容（10+ 词和单词均需验证）
- [ ] 在侧边栏显示选中文本
- [ ] 实现点击空白区域的页面级选择
- [ ] 调用 Zotero API 提取当前条目元数据（Abstract、ItemType、Tags）作为背景上下文
- [ ] 避免主线程进行重度文本处理

**里程碑**：PDF 中划词 → 侧边栏实时显示选中文本 + 自动拼接论文摘要

---

### 阶段 3：AI 服务对接 + 对话 UI（3-5 天）

**目标**：可视化配置 API，实现流式对话界面

- [ ] 完善 Preference Pane UI：Endpoint、API Key、模型选择、System Prompt 输入，绑定到 `Zotero.Prefs`
- [ ] 实现 `client.ts`（fetch POST 请求，OpenAI 兼容接口优先）
- [ ] 实现 SSE 流式解析器，打字机效果逐字渲染
- [ ] 实现 chat-input / chat-messages 组件（用户/AI 身份区分）
- [ ] 实现翻译功能（划词 → 自动发送 → 结果显示）
- [ ] 实现摘要功能
- [ ] 断网/401/429 异常处理与用户提示

**里程碑**：填入 API Key 后，划词触发翻译，AI 回复逐字显示，异常优雅提示

---

### 阶段 4：上下文管理（3-4 天）

**目标**：实现语义切片和跨页对话

- [ ] 文本分块（按段落/页面）
- [ ] Token 计算（字符估算，支持主流模型限制）
- [ ] 滑动窗口上下文记忆 + 自动裁剪
- [ ] 上下文注入（历史内容加入 AI 请求）
- [ ] V2 预留：预设 Prompt 模式（学术评审、无偏差解析）

**里程碑**：第 5 页提问"前面讲了什么"，AI 能引用第 1-4 页内容；100+ 页长文档响应 ≤15 秒

---

### 阶段 5：UI 完善与交互优化（2-3 天）

**目标**：提升用户体验，打通学术闭环

- [ ] 侧边栏位置切换（左右可调）
- [ ] 自动/手动模式切换
- [ ] 加载动画和进度指示
- [ ] 问答历史记录优化（时间戳、折叠长消息）
- [ ] 快捷键支持（`Ctrl+Shift+X` 呼出/隐藏侧边栏）
- [ ] V2 功能：「一键转笔记」：调用 Zotero API 保存有价值对话为 Child Note

**里程碑**：完整学术闭环"阅读 → 划词 → AI 探讨 → 转存笔记"

---

### 阶段 6：测试与发布（2-3 天）

**目标**：稳定可用

- [ ] 多语言支持（中文/英文，Fluent .ftl）
- [ ] 偏好设置持久化
- [ ] 编写 README（安装步骤、config 说明）
- [ ] 打包 .xpi 发布
- [ ] README 从零复现验证

---

## 验收标准

| 阶段 | 验证项 |
|------|--------|
| **1** | npm build 成功；Zotero 8 加载插件后右侧面板出现侧边栏；禁用/启用无需重启 |
| **2** | 选中 10+ 词/单词均正确显示；取消选择后状态符合设计；EPUB 事件正常触发（如支持）|
| **3** | config 错误有明确提示；5 秒内返回结果；断网显示网络错误；429 显示限流提示；连续 3 条消息历史完整 |
| **4** | 第 5 页能引用前几页内容；token 超限时自动裁剪；100+ 页 ≤15 秒响应 |
| **5** | 左右切换不崩溃；自动/手动模式生效；快捷键全窗口有效；长记录可滚动 |
| **6** | 打包 .xpi 可在干净 Zotero 8 安装；中文无乱码；README 可复现 |

---

## 风险与应对

| 风险 | 应对 |
|------|------|
| Zotero 8 API 变更 | 跟踪 zotero-plugin-template / zotero-pdf-translate 更新 |
| PDF.js 文本提取不稳定 | 使用 Zotero 内置 Reader API 而非直接操作 PDF.js |
| Token 超出模型限制 | 严格限制上下文窗口大小，实现自动裁剪 |
| fetch 在扩展沙箱受限 | 保持 `Zotero.HTTP.request` 作为 fallback |
| JSM → ESM 迁移遗漏 | 使用 `migrate-fx140` 脚本自动迁移 |
| 心理学实验扩展 scope creep | V1 聚焦核心功能，V2 再引入研究属性 |

---

## 参考资源

- [zotero-plugin-template](https://github.com/northword/zotero-plugin-template) — 插件模板（推荐起点）
- [zotero-plugin-toolkit](https://github.com/windingwind/zotero-plugin-toolkit) — API 工具库
- [zotero-pdf-translate](https://github.com/windingwind/zotero-pdf-translate) — 功能参考
- [Zotero 8 for Developers](https://www.zotero.org/support/dev/zotero_8_for_developers) — 官方开发文档
- [migrate-fx140 脚本](https://github.com/zotero/zotero/tree/main/scripts/migrate-fx140) — JSM/Bluebird 迁移
