# 🔍 业内顶流对标与 UX 风格分析指南 (Benchmark Analysis Guide)

在网页与产品工程开始前，Agent 必须通过行业顶流标杆分析，完成从“功能列举”到“高奢体验”的升维。

---

## 📌 顶流对标 4 维分析框架

### 1. 页面结构与功能组成 (Page Architecture & Core Components)
- **Top Navigation / Header**：
  - 吸顶固定与缩放状态（如 `authentic` 完整招牌 vs `compact` 极简吸顶版）。
  - 联系方式、预约按钮与多语言切换放置位置。
- **Hero Area (视觉第一屏)**：
  - 核心标语（Slogan）呈现方式（横排 vs 纵向 `writing-mode: vertical-rl` 宣纸书法）。
  - 视区动态 Banner 或超宽屏封顶视频。
- **Core Functional Blocks**：
  - 品牌故事/哲理切块、商品/菜单切片、实时 Google 地图卡片、评价与常见问题。

### 2. 核心页面与页面逻辑 (Page Hierarchy & User Flows)
- 导航路径深度：控制在 2-3 次点击内到达转化终点。
- 筛选与过滤：带状态持久化（`localStorage` 保存上一次选择的模板/条件）。
- 交互对话框与 Drawer：使用平滑侧滑抽屉或高对比度 Modal 替代粗暴跳转。

### 3. UX 交互逻辑 (UX Micro-Interactions)
- **Hover 反馈**：按钮在 Hover 时渐变提升亮度并右移箭头（如 `.arrow-link`）。
- **视认性与对比度**：纯黑文字 (`#000`) 与亮色 Badge 落款（`【萬福名物】`）。
- **实时数据同步**：编辑一处，全局全表/全货架秒级联动更新。

### 4. 设计与品牌风格 (Visual & Brand Identity)
- **配色系统提取**：
  - 底色：宣纸白 (`#F8F6F1`) / 柔和暗黑 (`#0F0F10`)
  - 主色：玄墨 (`#1A1816`)
  - 辅助色：朱砂印红 (`#9E2A22`)、琥珀古金 (`#C69A56`)、翡翠青绿 (`#1E5647`)
- **Typography 字体族**：
  - 中文/日文典雅字体：`Shippori Mincho`, `Noto Serif JP`
  - 英文衬线/无衬线：`Playfair Display`, `Cormorant Garamond`, `Inter`
