---
id: stable-query-client
title: 稳定的 Query Client
---

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
  await queryClient.query(options)
}
```

## 属性

- [x] ✅ 推荐
- [x] 🔧 可自动修复
