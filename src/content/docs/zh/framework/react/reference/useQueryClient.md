---
id: useQueryClient
title: useQueryClient
---

<!--
translation-source-path: framework/react/reference/useQueryClient.md
translation-source-ref: v5.90.3
translation-source-hash: 57e20f5c63ac769e4e423d59f8a1d0dfe3855c9f0f760b813aeba514f5bc049b
translation-status: translated
-->


`useQueryClient` Hook 返回当前的 `QueryClient` 实例。

```tsx
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient(queryClient?: QueryClient)
```

**选项**

- `queryClient?: QueryClient`
  - 使用此项可传入自定义 QueryClient。否则会使用最近上下文中的实例。
