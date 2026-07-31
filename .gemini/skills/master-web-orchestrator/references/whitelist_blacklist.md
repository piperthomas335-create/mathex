# 🛡️ 开发历史黑白名单与 Vercel 零 Warning 避坑指南 (Whitelist & Blacklist)

本规范总结了所有历史真实项目（`wanfu` 品牌重构、B2C 钢琴估值系统、WordPress CPT 批量发布、RetroShelf 货架系统等）的避坑经验，并补充了保证 Vercel CI/CD 一次性成功编译部署的工程铁律。

---

## 🚫 绝对黑名单 (Strict Blacklist)

### 1. 界面与 UI 设计黑名单
- **静态位图粘贴 Logo**：**禁止**直接切割静态 PNG/JPG 作为网站核心 Logo。必须解析实物招牌重构成纯 React / SVG 矢量代码组件。
- **超宽屏无限制横向拉伸**：**禁止**让全宽 Section 在 2K/4K/Ultrawide 屏幕上无限扩展。必须在容器内部强制包裹 `max-width: 1440px; margin: 0 auto;`。
- **低对比度文字与背景碰撞**：**禁止**在亮色彩/霓虹/暗黑背景上使用低对比度文字。必须统一使用高对比度纯黑 (`#000000`) 或高亮白色。
- **误选细部特写为商品主图**：**禁止**将钢琴脚轮/铸铁板序列号/局部特写图作为 CPT 商品列表的默认 Featured Image。必须锁定整琴/整店正前全景视角。
- **静态大图触发 Nginx 413**：**禁止**直接把原始 5MB-10MB 高清大图批量上传。必须预先压缩放缩至 1600px 宽度上限。
- **未清洗调试字符**：**禁止**在生产页面保留中文调试括号（如 `(立式钢琴)`）。

### 2. Vercel 构建与 TypeScript 编译黑名单
- **未转义 JSX 字符 (Unescaped Entities)**：**禁止**在 JSX/TSX 中直接写 `'` 或 `"`，会导致 Vercel 提示 `react/no-unescaped-entities` 报错中止。必须替换为 `&apos;` 或 `&quot;`。
- **Client/Server Component 漏标 `'use client'`**：**禁止**在包含 `useState`, `useEffect`, `framer-motion` 或事件监听的组件头部漏标 `'use client'`。
- **Next.js 15+ 动态参数非异步访问**：**禁止**直接访问 `params.id`。Next.js 15+ 中必须声明 `params: Promise<{ id: string }>` 并进行 `await params`。
- **`any` 隐式类型与 Warning**：**禁止**出现 `any` 类型或忽略 TypeScript 告警。Vercel 构建会将 TS Error 直接判定为 Build Failure。
- **未报备外部图片域名**：**禁止**在 `<Image />` 中使用未经 `next.config.js` 的 `remotePatterns` 报备的外部域名。

### 3. 服务器与运维黑名单
- **全量远端同步或全量覆盖**：**禁止**全量上传或全量覆盖线上服务器目录（如覆盖 `wp-content/uploads/` 或数据库）。必须使用细粒度增量推送协议。

---

## 🟢 必遵白名单 (Mandatory Whitelist)

1. **Vercel 一次性编译成功预检**：
   - 提交代码前，必须在本地终端运行并输出 **0 Error / 0 Warning**：
     ```powershell
     pnpm tsc --noEmit
     pnpm build
     ```
2. **真实地图与精准地理信息**：
   - 实体店页面必须嵌入带完整真实地址的 Google Maps iframe（例如：`愛知県一宮市奥町字田畑26-1 四川料理 萬福`，并附带 90 席座席/22 车位信息）。
3. **全局实时数据联动 (Real-time Sync)**：
   - 修改主数据项（如货架名称或全局 FOB 价格）时，界面上已置入的所有关联 Block/视图必须秒级实时同步。
4. **大数据表格 Freeze Columns (冻结列)**：
   - 超多列电子表格（如 27 列 Valuation 网格）必须固定左侧 ID/品牌/型号/序列号列。
5. **高奢配色与质感 Texture Overlay**：
   - 东方高奢风格必须引入宣纸噪点 SVG 底色 (`#F8F6F1`)、玄墨主色 (`#1A1816`)、朱砂印红 (`#9E2A22`) 及琥珀古金 (`#C69A56`)。
6. **本地隔离开发 (Local-First)**：
   - 所有改动必须先在 `http://127.0.0.1:8000` 或 `http://localhost:3000` 开发验证。
