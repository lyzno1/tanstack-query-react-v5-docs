---
id: devtools
title: Devtools
---

<!--
translation-source-path: framework/react/devtools.md
translation-source-ref: v5.90.3
translation-source-hash: 29b4d1cb9e9cffd1fc44be2e2080ec77c64b4b85be5edbe17755282046dc290d
translation-status: translated
-->


挥起双手欢呼吧，React Query 自带专用 devtools！🥳

当你开始使用 React Query 时，强烈建议把这些 devtools 常驻在身边。它们可以可视化 React Query 的内部运作机制，在你陷入问题时大概率能帮你省下数小时调试时间。

> 对于 Chrome、Firefox 和 Edge 用户：可以使用第三方浏览器扩展，直接在浏览器 DevTools 中调试 TanStack Query。它们提供与框架专用 devtools 包相同的功能：
>
> - <img alt="Chrome logo" src="https://www.google.com/chrome/static/images/chrome-logo.svg" width="16" height="16" class="inline mr-1 not-prose" /> [Devtools for Chrome](https://chromewebstore.google.com/detail/tanstack-query-devtools/annajfchloimdhceglpgglpeepfghfai)
> - <img alt="Firefox logo" src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg" width="16" height="16" class="inline mr-1 not-prose" /> [Devtools for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tanstack-query-devtools/)
> - <img alt="Edge logo" src="https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg" width="16" height="16" class="inline mr-1 not-prose" /> [Devtools for Edge](https://microsoftedge.microsoft.com/addons/detail/tanstack-query-devtools/edmdpkgkacmjopodhfolmphdenmddobj)

> 对于 React Native 用户：有一个第三方原生 macOS 应用可用于在任意基于 JS 的应用中调试 React Query，并实时监控多设备查询。查看这里：[rn-better-dev-tools](https://github.com/LovesWorking/rn-better-dev-tools)

> 注意：从 v5 开始，devtools 也支持观察 mutations。

## 安装并导入 Devtools

devtools 是一个需要单独安装的包：

```bash
npm i @tanstack/react-query-devtools
```

or

```bash
pnpm add @tanstack/react-query-devtools
```

or

```bash
yarn add @tanstack/react-query-devtools
```

or

```bash
bun add @tanstack/react-query-devtools
```

对于 Next 13+ App Dir，必须把它作为开发依赖安装才能正常工作。

你可以这样导入 devtools：

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
```

默认情况下，React Query Devtools 仅在 `process.env.NODE_ENV === 'development'` 时被打进 bundle，因此无需担心生产构建时手动排除。

## 浮动模式

浮动模式会把 devtools 以固定悬浮元素挂载到应用中，并在屏幕角落提供一个开关来显示或隐藏面板。该开关状态会存储在 `localStorage` 中，并在刷新后保留。

把以下代码尽量放在 React 应用中更高的位置，越接近页面根部效果越好。

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 选项

- `initialIsOpen: Boolean`
  - 如果希望 dev tools 默认展开，将其设为 `true`
- `buttonPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "relative"`
  - 默认值为 `bottom-right`
  - React Query 图标的位置，用于打开或关闭 devtools 面板
  - 若为 `relative`，按钮会放在你渲染 devtools 的位置
- `position?: "top" | "bottom" | "left" | "right"`
  - 默认值为 `bottom`
  - React Query devtools 面板的位置
- `client?: QueryClient`,
  - 用于传入自定义 QueryClient。否则会使用最近上下文中的实例。
- `errorTypes?: { name: string; initializer: (query: Query) => TError}[]`
  - 用于预定义可在查询上触发的错误类型。该错误在 UI 中开启时会调用 `initializer`（参数为具体 query），并且必须返回一个 Error。
- `styleNonce?: string`
  - 用于向插入到 document head 的 style 标签传递 nonce。当你使用 Content Security Policy（CSP）nonce 允许内联样式时很有用。
- `shadowDOMTarget?: ShadowRoot`
  - 默认行为是将 devtools 样式应用到 DOM 中的 head 标签。
  - 通过该选项可传入 shadow DOM 目标，使样式应用在 shadow DOM 中，而非 light DOM 的 head 标签。

## 嵌入模式

嵌入模式会将开发工具作为应用中的固定元素显示，你可以把我们的面板集成到你自己的开发工具中。

把以下代码尽量放在 React 应用中更高的位置，越接近页面根部效果越好。

```tsx
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

function App() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <button
        onClick={() => setIsOpen(!isOpen)}
      >{`${isOpen ? 'Close' : 'Open'} the devtools panel`}</button>
      {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />}
    </QueryClientProvider>
  )
}
```

### 选项

- `style?: React.CSSProperties`
  - devtools 面板的自定义样式
  - 默认值：`{ height: '500px' }`
  - 示例：`{ height: '100%' }`
  - 示例：`{ height: '100%', width: '100%' }`
- `onClose?: () => unknown`
  - devtools 面板关闭时触发的回调函数
- `client?: QueryClient`,
  - 用于传入自定义 QueryClient。否则会使用最近上下文中的实例。
- `errorTypes?: { name: string; initializer: (query: Query) => TError}[]`
  - 用于预定义可在查询上触发的错误类型。该错误在 UI 中开启时会调用 `initializer`（参数为具体 query），并且必须返回一个 Error。
- `styleNonce?: string`
  - 用于向插入到 document head 的 style 标签传递 nonce。当你使用 Content Security Policy（CSP）nonce 允许内联样式时很有用。
- `shadowDOMTarget?: ShadowRoot`
  - 默认行为是将 devtools 样式应用到 DOM 中的 head 标签。
  - 通过该选项可传入 shadow DOM 目标，使样式应用在 shadow DOM 中，而非 light DOM 的 head 标签。

## 在生产环境使用 Devtools

Devtools 在生产构建中默认会被排除。不过在某些场景下，你可能希望在生产环境里懒加载 devtools：

```tsx
import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Example } from './Example'

const queryClient = new QueryClient()

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
)

function App() {
  const [showDevtools, setShowDevtools] = React.useState(false)

  React.useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Example />
      <ReactQueryDevtools initialIsOpen />
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}
    </QueryClientProvider>
  )
}

export default App
```

这样一来，调用 `window.toggleDevtools()` 时就会下载 devtools bundle 并展示它们。

### 现代打包器

如果你的打包器支持 package exports，可以使用以下导入路径：

```tsx
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/production').then((d) => ({
    default: d.ReactQueryDevtools,
  })),
)
```

对于 TypeScript，需要在 tsconfig 中设置 `moduleResolution: 'nodenext'`，这至少要求 TypeScript v4.7。
