---
id: disabling-queries
title: 禁用/暂停查询
---

<!--
translation-source-path: framework/react/guides/disabling-queries.md
translation-source-ref: v5.90.3
translation-source-hash: 2ac06e279df6db4ac7b3abade980e24d21f8ef8453b9bd42273fda8087f121ca
translation-status: translated
-->


如果你想让某个查询不要自动运行，可以使用 `enabled = false` 选项。`enabled` 也支持传入返回布尔值的回调函数。

当 `enabled` 为 `false` 时：

- 如果查询已有缓存数据，则查询会以 `status === 'success'` 或 `isSuccess` 状态初始化。
- 如果查询没有缓存数据，则查询会以 `status === 'pending'` 和 `fetchStatus === 'idle'` 状态开始。
- 查询在挂载时不会自动获取。
- 查询不会在后台自动重新获取。
- 查询会忽略通常会触发重新获取的 query client `invalidateQueries` 与 `refetchQueries` 调用。
- 可以使用 `useQuery` 返回的 `refetch` 手动触发查询获取。但它不适用于 `skipToken`。

> TypeScript 用户可以考虑使用 [skipToken](#typesafe-disabling-of-queries-using-skiptoken) 作为 `enabled = false` 的替代方案。

[//]: # 'Example'

```tsx
function Todos() {
  const { isLoading, isError, data, error, refetch, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
    enabled: false,
  })

  return (
    <div>
      <button onClick={() => refetch()}>Fetch Todos</button>

      {data ? (
        <ul>
          {data.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : isLoading ? (
        <span>Loading...</span>
      ) : (
        <span>Not ready ...</span>
      )}

      <div>{isFetching ? 'Fetching...' : null}</div>
    </div>
  )
}
```

[//]: # 'Example'

永久禁用查询会让你放弃 TanStack Query 的很多优秀特性（例如后台重新获取），而且这也不是推荐的惯用方式。它会把你从声明式方式（定义查询在何时运行）带到命令式模式（点这里才去获取）。此外，`refetch` 也无法传参。很多时候你真正想要的是懒查询：延迟首次获取。

## 懒查询

`enabled` 不仅可用于永久禁用查询，也可用于在之后启用/禁用查询。一个典型示例是筛选表单：你只希望用户输入筛选值后再发起第一次请求。

[//]: # 'Example2'

```tsx
function Todos() {
  const [filter, setFilter] = React.useState('')

  const { data } = useQuery({
    queryKey: ['todos', filter],
    queryFn: () => fetchTodos(filter),
    // ⬇️ disabled as long as the filter is empty
    enabled: !!filter,
  })

  return (
    <div>
      // 🚀 applying the filter will enable and execute the query
      <FiltersForm onApply={setFilter} />
      {data && <TodosTable data={data} />}
    </div>
  )
}
```

[//]: # 'Example2'

### isLoading（此前为 `isInitialLoading`）

懒查询从一开始就是 `status: 'pending'`，因为 `pending` 表示还没有数据。这在技术上是正确的；但由于当前并未获取任何数据（查询还未 _enabled_），你往往无法用这个标记显示加载指示器。

如果你使用的是禁用查询或懒查询，可以改用 `isLoading` 标记。它是一个派生标记，计算方式为：

`isPending && isFetching`

因此，只有在查询**第一次**正在获取时它才为 `true`。

## 使用 `skipToken` 进行类型安全的查询禁用

如果你在使用 TypeScript，可以使用 `skipToken` 来禁用查询。它适用于“基于条件禁用查询，但仍希望查询保持类型安全”的场景。

> 重要：`useQuery` 的 `refetch` 与 `skipToken` 不兼容。除此之外，`skipToken` 与 `enabled: false` 行为一致。

[//]: # 'Example3'

```tsx
import { skipToken, useQuery } from '@tanstack/react-query'

function Todos() {
  const [filter, setFilter] = React.useState<string | undefined>()

  const { data } = useQuery({
    queryKey: ['todos', filter],
    // ⬇️ disabled as long as the filter is undefined or empty
    queryFn: filter ? () => fetchTodos(filter) : skipToken,
  })

  return (
    <div>
      // 🚀 applying the filter will enable and execute the query
      <FiltersForm onApply={setFilter} />
      {data && <TodosTable data={data} />}
    </div>
  )
}
```

[//]: # 'Example3'
