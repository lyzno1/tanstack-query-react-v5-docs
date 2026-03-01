---
id: useIsFetching
title: useIsFetching
---

<!--
translation-source-path: framework/react/reference/useIsFetching.md
translation-source-ref: v5.90.3
translation-source-hash: 12fd3b07f851c83381ce426b71fdb0a01bddef1e633d5e187627fbb6e34f726d
translation-status: translated
-->


`useIsFetching` 是一个可选 Hook，返回你的应用当前正在加载或在后台获取的查询 `number`（适用于全局加载指示器）。

```tsx
import { useIsFetching } from '@tanstack/react-query'
// 当前有多少个查询正在获取？
const isFetching = useIsFetching()
// 匹配 posts 前缀的查询中，有多少个正在获取？
const isFetchingPosts = useIsFetching({ queryKey: ['posts'] })
```

**选项**

- `filters?: QueryFilters`：[Query Filters](../../guides/filters.md#query-filters)
- `queryClient?: QueryClient`
  - 使用此项可传入自定义 QueryClient。否则会使用最近上下文中的实例。

**返回值**

- `isFetching: number`
  - 表示你的应用当前正在加载或在后台获取的查询数量 `number`。
