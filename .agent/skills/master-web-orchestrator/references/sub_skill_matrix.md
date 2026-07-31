# 🧩 子 Skill 调度矩阵与职责分工 (Sub-Skill Matrix & Orchestration)

`master-web-orchestrator` 作为统领级别的 Master Skill，在 7 阶段工作流中精细化调度以下子 Skill 矩阵。每一个子 Skill 专注解决特定的工程与设计问题。

---

## 🏛️ 子 Skill 注册表与能力映射

```
                               ┌──────────────────────────────────────────┐
                               │     master-web-orchestrator (Master)     │
                               └──────────────────────────────────────────┘
                                                    │
     ┌───────────────────┬──────────────────────────┼──────────────────────────┬───────────────────┐
     ▼                   ▼                          ▼                          ▼                   ▼
┌──────────────┐  ┌──────────────┐        ┌───────────────────┐      ┌──────────────────┐  ┌──────────────────────┐
│  v0 Best     │  │ shadcn UI    │        │ Tailwind & CSS    │      │ Framer Motion    │  │ Vercel Deployment    │
│  Practices   │  │ Primitives   │        │ Design System     │      │ Micro-Animations │  │ Build Validator      │
└──────────────┘  └──────────────┘        └───────────────────┘      └──────────────────┘  └──────────────────────┘
     │                   │                          │                          │                   │
     ▼                   ▼                          ▼                          ▼                   ▼
┌──────────────┐  ┌──────────────┐        ┌───────────────────┐      ┌──────────────────┐  ┌──────────────────────┐
│  Asset & SVG │  │ Playwright   │        │ Web Dev & Local   │      │ Industry         │  │ Incremental Remote   │
│  Vectorization│ │ Visual QA    │        │ First Workflow    │      │ Benchmark        │  │ Sync Protocol        │
└──────────────┘  └──────────────┘        └───────────────────┘      └──────────────────┘  └──────────────────────┘
```

---

## 📋 各阶段子 Skill 详细调用规则

### 阶段一：输入与素材预处理
- **`image-asset-processor` (图像与矢量处理子 Skill)**：
  - **触发条件**：收到用户提供的实体照片（招牌、商品、讲义）。
  - **职责**：
    1. **矢量化提取**：使用纯 React / SVG (`SVGPathElement`) 重新绘制实物 Logo（如 `wanfu-logo.tsx`），提取卷轴、印章与字体。
    2. **分辨率压缩**：使用 Sharp / Canvas 将高清大图放缩至 1600px 宽度上限，控制单图 <300KB。
    3. **白底过滤**：检测并自动剔除占比超 65% 的 A4 检测单/测试纸照片。
    4. **主图姿态分类**：判定整琴/整店正前全景图作为 CPT 的 `Featured Image`。

### 阶段三：业内顶流对标与 UX 风格分析
- **`benchmark-analyzer` (顶流标杆解构子 Skill)**：
  - **触发条件**：确定项目类型与对标对手（如高奢餐饮对标「飄香 Piao-Xiang」、SaaS 产品对标 Linear / Vercel）。
  - **职责**：输出 4 维解构分析报告（结构 + 核心逻辑 + UX 交互 + 视觉 Token）。

### 阶段四：需求汇报与开发者审批
- **`antigravity-guide` (Antigravity 机制与规划子 Skill)**：
  - **触发条件**：生成 `implementation_plan.md`，执行阶段 Gate 检查。
  - **职责**：规范汇报格式，明确标记设计选型、配色 Token 与 Vercel 构建风险点，向开发者请求 Proceed 批准。

### 阶段五：Block 落地搭建与界面工程
- **`v0-best-practices` (组件 Block 架构子 Skill)**：
  - **职责**：按 Header, Hero, Feature Grid, Pricing, Drawer 模块化拆分功能 Block。
- **`shadcn-ui-system` (组件基元子 Skill)**：
  - **职责**：使用 Radix UI 无障碍基元与 shadcn UI 主题构建 Dialog, Drawer, Dropdown, Table, Tabs 组件。
- **`tailwind-css-mastery` (视觉 Token 与样式子 Skill)**：
  - **职责**：实现 `globals.css` 宣纸噪点 Overlay (`#F8F6F1`)、玄墨底色 (`#1A1816`)、朱砂印红 (`#9E2A22`)、琥珀金边框 (`#C69A56`)、纵向排版 (`writing-mode: vertical-rl`) 以及大屏封顶 (`max-width: 1440px`)。
- **`framer-motion-effects` (微交互与微动画子 Skill)**：
  - **职责**：配置 Hover 抽屉平移、金线渐变、Webkit 展开动画以及 Layout 动画。

### 阶段六：黑白名单自查与视觉 QA 审查
- **`playwright-visual-qa` (视觉与 E2E 审查子 Skill)**：
  - **职责**：
    1. **4 视口快照对比**：执行 Mobile (`375`), Tablet (`768`), Desktop (`1440`), Ultrawide (`2560`) 截图矩阵。
    2. **动画遮罩与禁用**：开启 `animations: 'disabled'`，对动态广告使用 `mask`。
    3. **控制台/网络报错拦截**：监听 `console.error` 与网络 404/500。
- **`whitelist-blacklist-checker` (黑白名单校验子 Skill)**：
  - **职责**：扫描代码与 DOM，强制检查图片拉伸、霓虹背景纯黑高对比度文字 (`#000`)、遗留中文括号清洗。

### 阶段七：Vercel 零 Warning 构建与增量部署
- **`vercel-deployment-validator` (Vercel 构建校验子 Skill)**：
  - **职责**：
    1. 执行 TypeScript 严格模式检查 (`pnpm tsc --noEmit`)，零 `any` / 零 Warning。
    2. 校验 JSX 转义字符（如 `&apos;` 替代 `'`）。
    3. 校验 Client Components 是否正确标注 `'use client'`。
    4. 执行 `pnpm build` / `npm run build`，确保所有 SSG / SSR / API Routes 完美通过。
- **`web-development-workflow` (增量远端同步子 Skill)**：
  - **职责**：本地优先验证，细粒度增量文件同步（只推送变动的代码，严禁全量覆盖线上数据与静态资源）。
