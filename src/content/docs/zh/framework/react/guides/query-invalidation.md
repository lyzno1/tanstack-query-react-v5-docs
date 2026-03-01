---
id: query-invalidation
title: 查询失效
---

<!--
translation-source-path: framework/react/guides/query-invalidation.md
translation-source-ref: v5.90.3
translation-source-hash: e00c3f205c131ba26b1dede60a4d78acb62a2c8f11fbd5bc8cd1fb781cdfe895
translation-status: translated
-->


等待查询变为过期后再重新获取，并不总是有效，尤其是在你明确知道由于用户操作导致查询数据已过时的情况下。为此，`QueryClient` 提供了 `invalidateQueries` 方法，让你可以智能地将查询标记为过期，并在需要时触发重新获取。

[//]: # 'Example'

```tsx
// Invalidate every query in the cache
queryClient.invalidateQueries()
// Invalidate every query with a key that starts with `todos`
queryClient.invalidateQueries({ queryKey: ['todos'] })
```

[//]: # 'Example'

> 注意：一些使用规范化缓存的库，通常会尝试通过命令式方式或基于 schema 推断来更新本地查询。TanStack Query 则提供了另一套工具，避免你手动维护规范化缓存，转而采用**有针对性的失效、后台重新获取，以及最终的原子更新**。

当使用 `invalidateQueries` 使查询失效时，会发生两件事：

- 查询会被标记为过期。这个过期状态会覆盖 `useQuery` 或相关 hooks 中配置的任何 `staleTime`
- 如果该查询当前正通过 `useQuery` 或相关 hooks 渲染，它还会在后台重新获取

## 使用 `invalidateQueries` 进行查询匹配

当使用 `invalidateQueries`、`removeQueries`（以及其他支持部分匹配的 API）时，你可以通过前缀匹配多个查询，也可以非常精确地匹配某一个查询。关于可用过滤器类型，请参见 [查询过滤器](../filters.md#query-filters)。

在下面的示例中，我们可以使用 `todos` 前缀来使所有查询键以 `todos` 开头的查询失效：

[//]: # 'Example2'

```tsx
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Get QueryClient from the context
const queryClient = useQueryClient()

queryClient.invalidateQueries({ queryKey: ['todos'] })

// Both queries below will be invalidated
const todoListQuery = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
})
const todoListQuery = useQuery({
  queryKey: ['todos', { page: 1 }],
  queryFn: fetchTodoList,
})
```

[//]: # 'Example2'

你甚至可以通过向 `invalidateQueries` 传入更具体的查询键，只让带有特定变量的查询失效：

[//]: # 'Example3'

```tsx
queryClient.invalidateQueries({
  queryKey: ['todos', { type: 'done' }],
})

// The query below will be invalidated
const todoListQuery = useQuery({
  queryKey: ['todos', { type: 'done' }],
  queryFn: fetchTodoList,
})

// However, the following query below will NOT be invalidated
const todoListQuery = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
})
```

[//]: # 'Example3'

`invalidateQueries` API 非常灵活，因此即使你只想让**仅包含** `todos` 而不带更多变量或子键的查询失效，也可以传入 `exact: true`：

[//]: # 'Example4'

```tsx
queryClient.invalidateQueries({
  queryKey: ['todos'],
  exact: true,
})

// The query below will be invalidated
const todoListQuery = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
})

// However, the following query below will NOT be invalidated
const todoListQuery = useQuery({
  queryKey: ['todos', { type: 'done' }],
  queryFn: fetchTodoList,
})
```

[//]: # 'Example4'

如果你希望获得**更细粒度**的控制，可以向 `invalidateQueries` 传入谓词函数。该函数会接收查询缓存中的每个 `Query` 实例，并让你返回 `true` 或 `false` 决定该查询是否应失效：

[//]: # 'Example5'

```tsx
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'todos' && query.queryKey[1]?.version >= 10,
})

// The query below will be invalidated
const todoListQuery = useQuery({
  queryKey: ['todos', { version: 20 }],
  queryFn: fetchTodoList,
})

// The query below will be invalidated
const todoListQuery = useQuery({
  queryKey: ['todos', { version: 10 }],
  queryFn: fetchTodoList,
})

// However, the following query below will NOT be invalidated
const todoListQuery = useQuery({
  queryKey: ['todos', { version: 5 }],
  queryFn: fetchTodoList,
})
```

[//]: # 'Example5'
