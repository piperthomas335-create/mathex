# 🎨 设计 Token 与多视口响应式边界 (Responsive Design Tokens & Boundaries)

---

## 📐 一、 布局边界与约束 Token

| 边界类型 | CSS Token / 属性 | 作用与规范 |
| :--- | :--- | :--- |
| **Ultrawide Max-Width** | `max-width: 1440px; margin: 0 auto;` | 全宽 Section 内部强制包裹容器，防止 2K/4K 横向过度拉伸 |
| **Grid Column Gaps** | `gap-4 md:gap-6 lg:gap-8` | 弹性响应间距，随视口放缩 |
| **Section Padding** | `py-12 md:py-20 lg:py-28` | 保证上下视区有呼吸感，避免元素过于拥挤 |
| **Border Accent Line** | `border: 1px solid #C69A56` | 琥珀金精致分割线与卡片边框 |

---

## 📱 二、 4 视口 QA 矩阵

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ Mobile          │   │ Tablet          │   │ Desktop         │   │ Ultrawide       │
│ (375px x 812px) │   │ (768px x 1024px)│   │ (1440px x 900px)│   │ (2560px x 1440px│
└─────────────────┘   └─────────────────┘   └─────────────────┘   └─────────────────┘
```

1. **Mobile (`375px × 812px`)**：
   - 抽屉菜单折叠，导航转为 Hamburger 图标。
   - 字体大小适屏放缩 (`text-sm / text-base`)。
   - 严禁出现横向滚动条 (`overflow-x: hidden`)。

2. **Tablet (`768px × 1024px`)**：
   - 多列 Grid 弹性堆叠为 2 栏。
   - 保证触摸热区大于 `44px × 44px`。

3. **Desktop (`1440px × 900px`)**：
   - 完整展示 Mega Menu 与 Hero 区域。
   - Hover 交互生效，包含流畅 CSS 动画。

4. **Ultrawide (`2560px × 1440px`)**：
   - 居中渲染 1440px 容器。
   - 视区左右两侧展示优雅暗色/噪点渐变羽化。
