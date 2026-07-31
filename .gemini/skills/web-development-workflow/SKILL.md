---
name: web-development-workflow
description: 工业级网页开发、视觉回归 (Visual Regression) 与 E2E 自动化 QA 技能。融合 GitHub 开源最高标准 Playwright 视觉快照对比、动画遮罩 (Animation Masking)、控制台报错拦截 (Console Error Interception)、多视口模拟 (Multi-Viewport Matrix) 与增量部署协议。当用户需要开发网页、重构 UI、点按测试或评估响应式兼容性时激活此技能。
---

# 🌐 工业级网页开发与 E2E 自动化 QA 技能 (Web Development & E2E Skill)

本技能参考 GitHub 上开源高星 E2E 测试及视觉回归 (Visual Regression Testing) 的上位替代最佳实践，构建涵盖**本地优先开发**、**视觉快照基线对比**、**控制台/网络报错拦截**、**Playwright 交互驱动**与**增量同步**的标准工作流。

---

## 🚀 核心架构与阶段指南

```
┌───────────────────────────┐      ┌───────────────────────────┐
│ 1. 本地优先开发与设计系统 │ ---> │ 2. 视觉快照与动画遮罩审计 │
└───────────────────────────┘      └───────────────────────────┘
                                                 │
                                                 ▼
┌───────────────────────────┐      ┌───────────────────────────┐
│ 4. 多视口矩阵与兼容性测试 │ <--- │ 3. E2E 交互与控制台报错拦截│
└───────────────────────────┘      └───────────────────────────┘
              │
              ▼
┌───────────────────────────┐
│ 5. 细粒度增量远端同步协议 │
└───────────────────────────┘
```

---

## 阶段一：本地优先网页开发 (Web Development)

1. **本地隔离约束 (Local-First Isolation)**：
   - 所有网页结构 (HTML/PHP)、样式 (CSS) 和脚本 (JS) 开发 **100% 先在本地环境** (`http://127.0.0.1:8000`) 进行。
   - 绝不在生产环境直接做测试性修改。

2. **shadcn UI 高奢设计规范**：
   - 遵循现代极简风格（shadcn UI），搭配精选亮色/暗色调调色板。
   - 使用统一现代字体族 (`Inter`, `Playfair Display`, `Cinzel`)。
   - 必须提供 Hover 微互动、Focus 聚焦光圈及 CSS Transition，禁止输出未打磨的原始裸 HTML。

3. **大屏上限约束 (Ultrawide Scaling Guard)**：
   - 全宽 Section 强制包裹 `max-width: 1440px; margin: 0 auto;` 容器上限，防止 2K/4K/超宽屏无限制横向拉伸导致卡片与视频变形。

---

## 阶段二：视觉快照与动画遮罩审计 (Visual Regression & Masking)

借鉴 Playwright `toHaveScreenshot()` 视觉回归最佳实践：

1. **动画禁用与动态掩码 (Animation Disabling & Masking)**：
   - 截图对比前，对 CSS 动画与 Transition 启用 `animations: 'disabled'`。
   - 对随机变化的倒计时、动态 Banner 使用掩码遮罩 (`mask`)，消除非预期像素抖动造成的假阳性报误。

2. **视觉缺陷基线检查 (Visual Audit Checklist)**：
   - [ ] **图片填充比例 (`object-fit: contain/cover`)**：严禁纵向/横向拉伸变形。
   - [ ] **无关占位图清理**：检查并剔除与主题无关的随机占位图。
   - [ ] **文字排版与中英文标点**：确保英文页面中剔除遗留的中文括号 `(立式钢琴)`。

---

## 阶段三：E2E 交互驱动与控制台报错拦截 (E2E Driving & Interception)

借鉴 GitHub E2E Agent 自动化抓包与事件响应机制：

1. **控制台与网络报错拦截 (Console & Network Inspection)**：
   - 监听 `console.error` 事件，捕获未处理的未定义变量、语法错误与资源 404/500。
   - 检查路由重写规则 (Rewrite Rules)，确保 `.js` / `.json` 静态文件不会被错误拦截并返还 HTML。

2. **Playwright 用户流点按模拟 (Automated User Actions)**：
   - 自动填充表单（如输入 `4500000`）。
   - 触发按钮 Click / 回车提交。
   - 校验 DOM 节点渲染、Badge 标签生成及正确的数据匹配。

---

## 阶段四：多视口矩阵与兼容性测试 (Multi-Viewport Emulation)

在 4 种标准视口分辨率下测试响应式布局与性能：

| 视口类型 | 目标分辨率 | 检查重点 |
| :--- | :--- | :--- |
| **Mobile** | `375px × 812px` | 抽屉菜单展开、字体适屏缩放、无横向滚动条 |
| **Tablet** | `768px × 1024px` | 2 栏 Grid 弹性堆叠、触摸热区 |
| **Desktop** | `1440px × 900px` | 居中对齐、Mega Menu Hover 体验 |
| **Ultrawide** | `2560px × 1440px` | 1440px 容器封顶、Hero 视频高度约束 |

*API Snapshot (如 `pianos.json`) 响应时间必须小于 **50ms**。*

---

## 阶段五：细粒度增量远端同步协议 (Incremental Remote Sync)

1. **严格增量推送 (Incremental Sync Only)**：
   - 仅当用户明确命令“同步线上/推到服务器”时，**只推送改动或新增的文件**（如修改后的 `.php` / `.js` / `.css`）。
   - **严禁全量覆盖**或提取全量压缩包，保护线上动态数据库、用户上传资源 (`wp-content/uploads/`) 与服务器配置。
