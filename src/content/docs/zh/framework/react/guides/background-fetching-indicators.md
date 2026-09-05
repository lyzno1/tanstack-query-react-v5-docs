---
id: background-fetching-indicators
title: 后台获取指示器
---

查询的 `status === 'pending'` 状态足以显示初次的无缓存数据时的初始加载状态，但有时你可能还想额外显示一个“查询正在后台重新获取”的指示器。为此，查询还提供了 `isFetching` 布尔值，无论 `status` 变量当前处于什么状态，你都可以用它来显示正在获取中：

[//]: # 'Example'

```tsx
function Todos() {
  const {
    status,
    data: todos,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  return status === 'pending' ? (
    <span>Loading...</span>
  ) : status === 'error' ? (
    <span>Error: {error.message}</span>
  ) : (
    <>
      {isFetching ? <div>Refreshing...</div> : null}

      <div>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </div>
    </>
  )
}
```

[//]: # 'Example'

## 显示全局后台获取加载状态

除了单个查询的加载状态之外，如果你希望在**任意**查询正在获取（包括后台获取）时显示全局加载指示器，可以使用 `useIsFetching` Hook：

[//]: # 'Example2'

```tsx
import { useIsFetching } from '@tanstack/react-query'

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching()

  return isFetching ? (
    <div>Queries are fetching in the background...</div>
  ) : null
}
```

[//]: # 'Example2'
