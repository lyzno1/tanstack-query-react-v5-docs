---
id: queries
title: 查询
---

<!--
translation-source-path: framework/react/guides/queries.md
translation-source-ref: main
translation-source-hash: 3f0ccb1ffee73eb8cd9476e769c62a70af18fc1cc4250fce7bba7073bf6a80ab
translation-status: translated
-->


## 查询基础知识

查询是对绑定到**唯一键**的异步数据源的声明式依赖。查询可与任何基于 Promise 的方法（包括 GET 和 POST 方法）配合使用，从服务器获取数据。如果你的方法会修改服务器上的数据，建议改用[变更](./mutations.md)。

[//]: # 'SubscribeDescription'

要在组件或自定义 Hook 中订阅查询，调用 `useQuery` Hook 时至少需要提供：

[//]: # 'SubscribeDescription'

- **查询的唯一键**
- 返回 Promise 的函数：
  - resolve 为数据，或者
  - 抛出错误

[//]: # 'Example'

```tsx
import { useQuery } from '@tanstack/react-query'

function App() {
  const info = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })
}
```

[//]: # 'Example'

你提供的**唯一查询键**会在内部用于重新获取、缓存，以及在整个应用中共享查询。

`useQuery` 返回的结果包含渲染及其他数据使用场景所需的全部查询信息：

[//]: # 'Example2'

```tsx
const result = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })
```

[//]: # 'Example2'

`result` 对象包含几个非常重要的状态。查询在任意时刻只会处于以下状态之一：

- `isPending` 或 `status === 'pending'` - 查询还没有数据
- `isError` 或 `status === 'error'` - 查询遇到错误
- `isSuccess` 或 `status === 'success'` - 查询成功并且数据可用

除了这些主要状态之外，还可以根据查询的状态获取更多信息：

- `error` - 如果查询处于 `isError` 状态，则可通过 `error` 属性获取错误。
- `data` - 如果查询处于 `isSuccess` 状态，则可通过 `data` 属性获取数据。
- `isFetching` - 无论查询处于哪种状态，只要正在获取数据（包括后台重新获取），`isFetching` 就是 `true`。

对于**大多数**查询，通常先检查 `isPending`，再检查 `isError`，最后便可假定数据可用并渲染成功状态：

[//]: # 'Example3'

```tsx
function Todos() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  })

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

[//]: # 'Example3'

如果你不想使用这些布尔值，也可以直接使用 `status`：

[//]: # 'Example4'

```tsx
function Todos() {
  const { status, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  })

  if (status === 'pending') {
    return <span>Loading...</span>
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>
  }

  // also status === 'success', but "else" logic works, too
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

[//]: # 'Example4'

依次检查 `pending` 和 `error` 后，TypeScript 也会正确收窄 `data` 的类型。

### `fetchStatus`

除 `status` 外，结果中还有 `fetchStatus` 属性，可能取以下值：

- `fetchStatus === 'fetching'` - 查询当前正在获取数据。
- `fetchStatus === 'paused'` - 查询原本要获取数据，但目前已暂停。详情请参阅[网络模式](./network-mode.md)指南。
- `fetchStatus === 'idle'` - 查询目前没有执行任何操作。

### 为什么是两个不同的状态？

后台重新获取和 stale-while-revalidate 逻辑让 `status` 与 `fetchStatus` 的各种组合都有可能出现。例如：

- 处于 `success` 状态的查询，其 `fetchStatus` 通常是 `idle`；但如果正在后台重新获取，也可能是 `fetching`。
- 刚挂载且没有数据的查询通常处于 `pending` 状态，`fetchStatus` 为 `fetching`；但在没有网络连接时，也可能是 `paused`。

因此请记住，查询可能处于 `pending` 状态，但实际上并未获取数据。简单来说：

- `status` 描述 `data`：目前是否已有数据？
- `fetchStatus` 描述 `queryFn`：目前是否正在运行？

[//]: # 'Materials'

## 进一步阅读

关于另一种状态检查方式，请参阅 [TkDodo 的这篇文章](https://tkdodo.eu/blog/status-checks-in-react-query)。

[//]: # 'Materials'
