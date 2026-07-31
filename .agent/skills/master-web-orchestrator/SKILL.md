---
name: master-web-orchestrator
description: 统领级别的全流程网页设计、产品工程与 Agent 自动化工作流 Master Skill。涵盖从素材输入矢量化、情景分析、业内顶流 4 维对标、开发者审批关卡、结合 v0/shadcn/tailwind/framer 的 Block 搭建，到历史黑白名单自查与 Playwright 4 视口视觉 QA Review，并强制保证 100% 能在 Vercel 环境下零 Error/零 Warning 成功编译部署与细粒度增量同步。
---

# 🌐 网页与产品工程 Master Orchestrator Skill

本 Skill 为最高层级的统领 Master Skill，专为指导 Agent 构建**符合现代奢华设计标准**、**遵循黑白名单避坑准则**且**100% 保证在 Vercel 一次性编译成功**的网页与 Web 应用程序。它管控 7 阶段全流程链路，并调度 9 个专注子 Skill。

---

## 🧩 一、 子 Skill 矩阵与调度机制 (Sub-Skill Matrix)

*详细子 Skill 规范请参阅 [sub_skill_matrix.md](file:///C:/Users/mirai/.gemini/antigravity/skills/master-web-orchestrator/references/sub_skill_matrix.md)*

本 Master Skill 贯穿全流程并显式调度以下 9 个专用子 Skill：

| 阶段 (Phase) | 调度的子 Skill 名称 | 核心功能与职责 |
| :--- | :--- | :--- |
| **Phase 1: 素材输入** | `image-asset-processor` | 招牌照片纯 React SVG 矢量重构、图片放缩至 1600px（防 413）、A4 纯白检测单清洗、正前全景主图分类 |
| **Phase 3: 顶流对标** | `benchmark-analyzer` | 对标业内最高水平标杆（如 Piao-Xiang 飄香），解构“结构+核心逻辑+UX+视觉 Token” 4 维指标 |
| **Phase 4: 汇报关卡** | `antigravity-guide` | 撰写需求 Spec 报告，进行 Vercel 风险提示与审批 Gate 审查 |
| **Phase 5: Block 搭建** | `v0-best-practices` | 划分解构 Header / Hero / Feature / Grid / Drawer 功能 Block |
| **Phase 5: 组件基元** | `shadcn-ui-system` | 基于 Radix UI 构建无障碍奢华 Modal, Drawer, Tabs, Table |
| **Phase 5: 视觉 Token** | `tailwind-css-mastery` | 宣纸噪点 Overlay (`#F8F6F1`)、玄墨 (`#1A1816`)、朱砂印 (`#9E2A22`)、琥珀金 (`#C69A56`)、纵向排版 (`vertical-rl`) 与 1440px 上限 |
| **Phase 5: 微交互** | `framer-motion-effects` | 抽屉 Hover 移位、平滑渐变、Layout 动态展开 |
| **Phase 6: 视觉审查** | `playwright-visual-qa` | 4 视口快照矩阵对比 (`375`, `768`, `1440`, `2560`)、动画禁用掩码、`console.error` 与网络 404 拦截 |
| **Phase 6: 黑白名单** | `whitelist-blacklist-checker` | 强制对照历史黑白名单（图不拉伸、纯黑高对比文字 `#000`、无未化简中文括号、大表 Freeze 列） |
| **Phase 7: Vercel 编译**| `vercel-deployment-validator` | 运行 `pnpm tsc --noEmit` 与 `pnpm build`，检查 JSX 转义、`use client` 声明、API Dynamic Params |
| **Phase 7: 远端同步** | `web-development-workflow` | 本地优先隔离开发 (`http://127.0.0.1:8000`)，细粒度增量推送，严禁全量覆盖线上数据与用户上传资产 |

---

## 🏛️ 二、 7 阶段标准全流程 (Master Workflow Pipeline)

```
┌────────────────────────────────┐       ┌────────────────────────────────┐
│ Phase 1: 输入与素材矢量预处理 │ ----> │ Phase 2: 情景理解与需求分析    │
└────────────────────────────────┘       └────────────────────────────────┘
                                                         │
                                                         ▼
┌────────────────────────────────┐       ┌────────────────────────────────┐
│ Phase 4: 需求分析文档与审批关卡│ <---- │ Phase 3: 业内顶流对标 (4维解构)│
└────────────────────────────────┘       └────────────────────────────────┘
                │ (开发者/用户批准)
                ▼
┌────────────────────────────────┐       ┌────────────────────────────────┐
│ Phase 5: Block 详细搭建 (4 Skill)│ ----> │ Phase 6: 黑白名单与视觉 QA 审查│
└────────────────────────────────┘       └────────────────────────────────┘
                                                         │
                                                         ▼
                                         ┌────────────────────────────────┐
                                         │ Phase 7: Vercel 编译与增量同步 │
                                         └────────────────────────────────┘
```

---

## 📋 三、 阶段执行指令细节

### Phase 1: 输入与素材矢量预处理
- 调度 `image-asset-processor`：
  - 遇到招牌或 Logo 照片，**禁止贴低清 PNG/JPG 位图**，必须建立 React SVG 矢量代码组件（参照 `wanfu-logo.tsx` 经验），支持全分辨率无损缩放。
  - 原始大图一律放缩至 1600px 宽度上限，单张图片体积控制在 <300KB。
  - 自动检测并剔除白底占比 >65% 的检测单 A4 纸照片。

### Phase 2: 情景理解与初步分析
- 厘清域情景与数据流（如全局价格联动、`localStorage` 状态持久化、Sticky 列大表格）。

### Phase 3: 业内顶流对标与行业需求分析
- 调度 `benchmark-analyzer`（参阅 [benchmark_analysis_guide.md](file:///C:/Users/mirai/.gemini/antigravity/skills/master-web-orchestrator/references/benchmark_analysis_guide.md)）：
  1. 页面结构与功能 Block。
  2. 核心页面逻辑与 UX 交互路径。
  3. 微交互与视觉音效风格。
  4. 专属设计 Token。

### Phase 4: 需求分析文档与开发者审批关卡 (Gate Rule)
- 调度 `antigravity-guide`（参阅模板 [requirement_spec_template.md](file:///C:/Users/mirai/.gemini/antigravity/skills/master-web-orchestrator/templates/requirement_spec_template.md)）：
  - 写入需求分析文档，列出设计选型、配色系统、分页逻辑与 Vercel 风险点。
  - **强制关卡**：Agent 必须在汇报后等待开发者/用户批准 Proceed，方可进入代码构建阶段。

### Phase 5: Block 详细搭建与界面工程
- 融合 4 大前端子 Skill (`v0-best-practices`, `shadcn-ui-system`, `tailwind-css-mastery`, `framer-motion-effects`)：
  - **大屏封顶铁律**：全宽 Section 强制包裹 `max-width: 1440px; margin: 0 auto;` 容器上限（参阅 [responsive_design_tokens.md](file:///C:/Users/mirai/.gemini/antigravity/skills/master-web-orchestrator/references/responsive_design_tokens.md)）。
  - **高级质感**：宣纸噪点 Overlay、玄墨底色、朱砂落款、琥珀金边框、纵向排版 (`writing-mode: vertical-rl`)。
  - **视认性强化**：霓虹/深色背景上统一使用高对比度纯黑 (`#000`) 或高亮白色文字。

### Phase 6: 黑白名单自查与视觉 QA 审查
- 调度 `whitelist-blacklist-checker`（参阅 [whitelist_blacklist.md](file:///C:/Users/mirai/.gemini/antigravity/skills/master-web-orchestrator/references/whitelist_blacklist.md)）：
  - 扫描校验图片无拉伸变形 (`object-fit: cover/contain`)，清洗未化简的中文括号。
- 调度 `playwright-visual-qa`：
  - 4 视口快照矩阵测试 (`375`, `768`, `1440`, `2560`)。
  - 禁用动画 `animations: 'disabled'` 并对动态广告应用遮罩 `mask`。
  - 拦截 `console.error` 与网络 404/500。

### Phase 7: Vercel 零 Warning 构建与增量远端同步
- 调度 `vercel-deployment-validator`（参阅 [vercel_build_guarantee.md](file:///C:/Users/mirai/.gemini/antigravity/skills/master-web-orchestrator/references/vercel_build_guarantee.md)）：
  - 规则 1：检查所有单/双引号转义（用 `&apos;` 替代 `'`）。
  - 规则 2：带交互/State/Hooks 的组件第一行强制加 `'use client';`。
  - 规则 3：Next.js 15+ 动态路由使用 `await params`。
  - 规则 4：`next.config.js` 正确报备图片域名。
  - 规则 5：本地必须通过命令预检：
    ```powershell
    pnpm tsc --noEmit
    pnpm build
    ```
- 调度 `web-development-workflow`：
  - 本地优先 (`127.0.0.1:8000` / `localhost:3000`) 隔离测试。
  - 增量远端同步协议（仅推送变动的代码，严禁全量覆盖线上数据与静态资源）。
