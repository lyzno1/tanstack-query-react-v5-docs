---
id: stable-query-client
title: Stable Query Client
---

<!--
translation-source-path: eslint/stable-query-client.md
translation-source-ref: v5.90.3
translation-source-hash: c1dfb2a1e569e8b729ffa61c1334936d731d2dc06bb730c5b18c752007ff148e
translation-status: translated
-->


QueryClient 包含 QueryCache，因此在应用生命周期内你通常只应创建一个 QueryClient 实例，而**不是**每次渲染都创建新实例。

> 例外：允许在异步 Server Component 内创建新的 QueryClient，因为该异步函数在服务端只会调用一次。

## 规则详情

此规则的**错误**代码示例：

```tsx
/* eslint "@tanstack/query/stable-query-client": "error" */

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}
```

此规则的**正确**代码示例：

```tsx
function App() {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}
```

```tsx
const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}
```

```tsx
async function App() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(options)
}
```

## 属性

- [x] ✅ Recommended
- [x] 🔧 Fixable
