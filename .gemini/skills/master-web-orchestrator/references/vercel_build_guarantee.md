# 🚀 Vercel 零 Error / 零 Warning 生产构建保证协议 (Vercel Build Guarantee)

为了确保网页与 Web App **100% 能在 Vercel 自动化 CI/CD 环境中一次性成功 Build 部署**，必须在本地编译阶段严格遵守以下 Vercel 构建铁律。

---

## 🚫 一、 Vercel 构建常见中断原因与避坑黑名单

### 1. JSX 特殊字符未转义 (Unescaped Entities)
- **踩坑现象**：在 JSX/TSX 中直接输入单引号 `'` 或双引号 `"` 导致 Vercel Next.js `react/no-unescaped-entities` 报错终止。
- **解决方案**：
  - 用 `&apos;` 替换 `'`（例：`Don&apos;t` 替换 `Don't`）。
  - 用 `&quot;` 替换 `"`。
  - 用 `&#123;` 和 `&#125;` 替换 `{` 和 `}`。

### 2. Client / Server Component 边界划分不清
- **踩坑现象**：在 Server Component 中使用了 `useState` / `useEffect` / `onClick` / `framer-motion`，或者在 Client Component 中直接导入服务端只读模块。
- **解决方案**：
  - 凡是带有交互（State, Event, Animation, Context, Custom Hooks）的文件，**第一行必须显式声明 `'use client';`**。
  - 尽量把交互隔离在叶子节点组件中，保持 Page 根页面作为 Server Component，提升 SEO 与 Vercel SSR 性能。

### 3. Next.js 15+ 动态路由与 API Params 异步化突破
- **踩坑现象**：Next.js 15+ 中 `params` 和 `searchParams` 变为 `Promise` 类型，直接访问 `params.id` 会导致类型错误。
- **解决方案**：
  - 正确类型声明与 await 拆解：
    ```tsx
    // Next.js 15 示例
    export default async function Page({ params }: { params: Promise<{ id: string }> }) {
      const { id } = await params;
      return <div>ID: {id}</div>;
    }
    ```

### 4. 严格 TypeScript 类型报错 (`tsc` 拦截)
- **踩坑现象**：使用 `any` 隐式类型、未定义的 Component Prop、`Object is possibly 'undefined'`。
- **解决方案**：
  - 开启 `pnpm tsc --noEmit` 或 `npx tsc --noEmit` 进行预检。
  - 所有 Component Props 必须明确 Interface 定义，禁传模糊对象。

### 5. `next/image` 域名未在 `next.config.js` 报备
- **踩坑现象**：使用 `<Image src="https://example.com/photo.jpg" />` 导致 Vercel 运行时 `Invalid src prop` 报错。
- **解决方案**：
  - 在 `next.config.js` 中显式配置 `remotePatterns`：
    ```js
    /** @type {import('next').NextConfig} */
    const nextConfig = {
      images: {
        remotePatterns: [
          { protocol: 'https', hostname: '**' },
        ],
      },
    };
    module.exports = nextConfig;
    ```

### 6. ESLint 规则拦截
- **踩坑现象**：存在 `unused-vars` (未使用的变量/Import) 或 `react-hooks/exhaustive-deps` 警告在 Vercel 严管模式下升格为 Error。
- **解决方案**：
  - 清理所有未引用的组件与变量。
  - 确保 Hook 依赖数组完整。

---

## 🛠️ 二、 Vercel 预飞检查清单 (Pre-flight Inspection Command)

在声称“完成构建”前， Agent **必须在本地运行**以下自动化预检指令流：

```powershell
# 1. 严格 TypeScript 静默类型检查
pnpm tsc --noEmit

# 2. Vercel 生产打包打包测试
pnpm build
```

**只有当 `pnpm build` 输出 `✓ Compiled successfully` 并且零 Warning 时，才算真正通过 Vercel 部署验证！**

---

## ⚙️ 三、 推荐的 `next.config.js` 最佳实践配置

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // 确保 Vercel 构建日志清晰
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

module.exports = nextConfig;
```
