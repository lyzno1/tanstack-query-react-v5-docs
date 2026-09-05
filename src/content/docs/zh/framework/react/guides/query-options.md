---
id: query-options
title: 查询选项
---

在多个位置共享 `queryKey` 和 `queryFn`，同时让它们保持就近维护，最好的方式之一是使用
`queryOptions` 辅助函数。运行时它只是原样返回传入的内容，但与 [TypeScript](../typescript.md#typing-query-options)
配合时有很多优势。你可以集中定义某个查询的所有选项，并在各处获得类型推断和类型安全。

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
queryClient.query(groupOptions(23))
queryClient.setQueryData(groupOptions(42).queryKey, newGroups)
```

[//]: # 'Example1'

对于无限查询，可使用单独的 [`infiniteQueryOptions`](../reference/functions/infiniteQueryOptions.md) 辅助函数。

[//]: # 'SelectDescription'

你仍然可以在组件层覆盖部分选项。一个非常常见且实用的模式是为每个组件创建各自的 [`select`](./render-optimizations.md#select) 函数：

[//]: # 'SelectDescription'

[//]: # 'Example2'

```ts
// Type inference still works, so query.data will be the return type of select instead of queryFn

const query = useQuery({
  ...groupOptions(1),
  select: (data) => data.groupName,
})
```

[//]: # 'Example2'
