---
id: initial-query-data
title: 初始查询数据
---

<!--
translation-source-path: framework/react/guides/initial-query-data.md
translation-source-ref: v5.90.3
translation-source-hash: a4de3908b66a613bace5fed051f93a0b1be1215fedf635cbb2a94613c4aa69ee
translation-status: translated
-->


在真正需要某个查询之前，你可以通过多种方式把初始数据放进缓存：

- 声明式：
  - 向查询提供 `initialData`，在缓存为空时预填充缓存
- 命令式：
  - [使用 `queryClient.prefetchQuery` 预取数据](../prefetching.md)
  - [使用 `queryClient.setQueryData` 手动将数据写入缓存](../prefetching.md)

## 使用 `initialData` 预填充查询

有时应用里已经有某个查询的初始数据，这时可以直接传给查询。在这种情况下，你可以使用 `config.initialData` 选项设置查询的初始数据，并跳过初始加载状态。

> 重要：`initialData` 会持久化到缓存，因此不建议传入占位、部分或不完整数据。此类场景请改用 `placeholderData`。

[//]: # 'Example'

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: initialTodos,
})
```

[//]: # 'Example'

### `staleTime` 与 `initialDataUpdatedAt`

默认情况下，`initialData` 会被视为“刚获取到的全新数据”。这也意味着它会影响 `staleTime` 选项的解释方式。

- 如果你为查询观察者配置了 `initialData`，但没有配置 `staleTime`（即默认 `staleTime: 0`），查询在挂载时会立即重新获取：

  [//]: # 'Example2'

  ```tsx
  // Will show initialTodos immediately, but also immediately refetch todos after mount
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    initialData: initialTodos,
  })
  ```

  [//]: # 'Example2'

- 如果你为查询观察者同时配置了 `initialData` 和 `staleTime: 1000` 毫秒，数据会在这段时间内被视为新鲜，就像它刚从查询函数获取到一样。

  [//]: # 'Example3'

  ```tsx
  // Show initialTodos immediately, but won't refetch until another interaction event is encountered after 1000 ms
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    initialData: initialTodos,
    staleTime: 1000,
  })
  ```

  [//]: # 'Example3'

- 那如果 `initialData` 并不新鲜呢？这就需要最后一种、也是更准确的配置：`initialDataUpdatedAt`。该选项允许你传入 `initialData` 最后更新时间（毫秒级 JS 时间戳，例如 `Date.now()` 的值）。注意：如果你拿到的是 Unix 时间戳，需要乘以 `1000` 转为 JS 时间戳。

  [//]: # 'Example4'

  ```tsx
  // Show initialTodos immediately, but won't refetch until another interaction event is encountered after 1000 ms
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
    initialData: initialTodos,
    staleTime: 60 * 1000, // 1 minute
    // This could be 10 seconds ago or 10 minutes ago
    initialDataUpdatedAt: initialTodosUpdatedTimestamp, // eg. 1608412420052
  })
  ```

  [//]: # 'Example4'

  这个选项让 `staleTime` 回归其原本用途：判断数据需要多新；同时也允许在 `initialData` 比 `staleTime` 更旧时在挂载时重新获取。上面示例里，我们要求数据在 1 分钟内保持新鲜，并通过提示查询 `initialData` 最后更新时间，让查询自行决定是否需要再次重新获取。

  > 如果你更愿意把这些数据视为**预取数据（prefetched data）**，建议使用 `prefetchQuery` 或 `fetchQuery` API 预先填充缓存，这样你就可以将 `staleTime` 与 `initialData` 独立配置。

### Initial Data Function

如果获取查询初始数据的过程开销较大，或你不希望每次渲染都执行该逻辑，可以把函数作为 `initialData` 值传入。该函数只会在查询初始化时执行一次，从而节省内存和/或 CPU：

[//]: # 'Example5'

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/todos'),
  initialData: () => getExpensiveTodos(),
})
```

[//]: # 'Example5'

### 来自缓存的初始数据

在某些场景下，你可以从另一个查询的缓存结果中为当前查询提供初始数据。典型例子是：从 todos 列表查询的缓存中找到某个 todo，再把它作为单个 todo 查询的初始数据。

[//]: # 'Example6'

```tsx
const result = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetch('/todos'),
  initialData: () => {
    // Use a todo from the 'todos' query as the initial data for this todo query
    return queryClient.getQueryData(['todos'])?.find((d) => d.id === todoId)
  },
})
```

[//]: # 'Example6'

### 使用 `initialDataUpdatedAt` 处理来自缓存的初始数据

从缓存读取初始数据通常意味着该源查询可能已经较旧。与其通过人为设置 `staleTime` 来避免立即重新获取，更推荐把源查询的 `dataUpdatedAt` 传给 `initialDataUpdatedAt`。这样查询实例就拥有了判断“是否、何时需要重新获取”的完整信息，而不受“提供了初始数据”这一事实影响。

[//]: # 'Example7'

```tsx
const result = useQuery({
  queryKey: ['todos', todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () =>
    queryClient.getQueryData(['todos'])?.find((d) => d.id === todoId),
  initialDataUpdatedAt: () =>
    queryClient.getQueryState(['todos'])?.dataUpdatedAt,
})
```

[//]: # 'Example7'

### 来自缓存的条件式初始数据

如果你用于查找初始数据的源查询已经较旧，你可能根本不想使用缓存数据，而是直接从服务端获取。为了更容易做这个判断，可以改用 `queryClient.getQueryState` 获取源查询更多信息，包括 `state.dataUpdatedAt` 时间戳，再据此判断该查询是否“足够新鲜”。

[//]: # 'Example8'

```tsx
const result = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetch(`/todos/${todoId}`),
  initialData: () => {
    // Get the query state
    const state = queryClient.getQueryState(['todos'])

    // If the query exists and has data that is no older than 10 seconds...
    if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
      // return the individual todo
      return state.data.find((d) => d.id === todoId)
    }

    // Otherwise, return undefined and let it fetch from a hard loading state!
  },
})
```

[//]: # 'Example8'
[//]: # 'Materials'

## 延伸阅读

关于 `Initial Data` 与 `Placeholder Data` 的对比，可查看[社区资源](../../community/tkdodos-blog.md#9-placeholder-and-initial-data-in-react-query)中的文章。

[//]: # 'Materials'
