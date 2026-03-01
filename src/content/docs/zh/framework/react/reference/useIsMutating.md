---
id: useIsMutating
title: useIsMutating
---

<!--
translation-source-path: framework/react/reference/useIsMutating.md
translation-source-ref: v5.90.3
translation-source-hash: af5d718588c544d884d3c246265897a05f69f5ffcbde4edcf3886912ab68708e
translation-status: translated
-->


`useIsMutating` 是一个可选 Hook，返回你的应用当前正在获取的变更 `number`（适用于全局加载指示器）。

```tsx
import { useIsMutating } from '@tanstack/react-query'
// 当前有多少个变更正在获取？
const isMutating = useIsMutating()
// 匹配 posts 前缀的变更中，有多少个正在获取？
const isMutatingPosts = useIsMutating({ mutationKey: ['posts'] })
```

**选项**

- `filters?: MutationFilters`：[Mutation Filters](../../guides/filters.md#mutation-filters)
- `queryClient?: QueryClient`
  - 使用此项可传入自定义 QueryClient。否则会使用最近上下文中的实例。

**返回值**

- `isMutating: number`
  - 表示你的应用当前正在获取的变更数量 `number`。
