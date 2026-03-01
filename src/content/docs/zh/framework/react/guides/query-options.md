---
id: query-options
title: 查询选项
---

<!--
translation-source-path: framework/react/guides/query-options.md
translation-source-ref: v5.90.3
translation-source-hash: 4d9b49d2ad4a34e7847aa6d23642647fd3a2dbbbad48d39e2a7a376cee1be6f1
translation-status: translated
-->


在多个位置共享 `queryKey` 和 `queryFn`，同时又让它们保持就近维护的一个最佳方式，是使用 `queryOptions` 辅助函数。运行时它只是原样返回你传入的配置，但在 [TypeScript 场景](../../typescript.md#typing-query-options) 下有很多优势。你可以在一个地方定义某个查询的全部可选项，并获得完整的类型推断和类型安全。

[//]: # 'Example1'

```ts
import { queryOptions } from '@tanstack/react-query'

function groupOptions(id: number) {
  return queryOptions({
    queryKey: ['groups', id],
    queryFn: () => fetchGroups(id),
    staleTime: 5 * 1000,
  })
}

// usage:

useQuery(groupOptions(1))
useSuspenseQuery(groupOptions(5))
useQueries({
  queries: [groupOptions(1), groupOptions(2)],
})
queryClient.prefetchQuery(groupOptions(23))
queryClient.setQueryData(groupOptions(42).queryKey, newGroups)
```

[//]: # 'Example1'

对于无限查询，可使用单独的 [`infiniteQueryOptions`](../../reference/infiniteQueryOptions.md) 辅助函数。

你仍然可以在组件层覆盖部分选项。一个非常常见且实用的模式是为每个组件创建各自的 [`select`](../render-optimizations.md#select) 函数：

[//]: # 'Example2'

```ts
// Type inference still works, so query.data will be the return type of select instead of queryFn

const query = useQuery({
  ...groupOptions(1),
  select: (data) => data.groupName,
})
```

[//]: # 'Example2'
