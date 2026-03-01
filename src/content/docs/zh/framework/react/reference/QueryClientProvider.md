---
id: QueryClientProvider
title: QueryClientProvider
---

<!--
translation-source-path: framework/react/reference/QueryClientProvider.md
translation-source-ref: v5.90.3
translation-source-hash: 88392d3389c87ab221dcca5390d32fae5200b0b0f7757456f27652922d6d8f4c
translation-status: translated
-->


使用 `QueryClientProvider` 组件把 `QueryClient` 连接并提供给你的应用：

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

**选项**

- `client: QueryClient`
  - **必填**
  - 要提供的 QueryClient 实例
