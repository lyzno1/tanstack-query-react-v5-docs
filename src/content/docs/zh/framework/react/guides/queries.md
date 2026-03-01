---
id: queries
title: 查询
---

<!--
translation-source-path: framework/react/guides/queries.md
translation-source-ref: v5.90.3
translation-source-hash: 7e9d39b3c2a34bd872b9bac0f7dbb274c0d6d430dba9a0a0d6a18c414ee4db11
translation-status: translated
-->


## 查询基础知识

查询是对绑定到**唯一键**的异步数据源的声明性依赖。查询可以与任何基于 Promise 的方法（包括 GET 和 POST 方法）一起使用，以从服务器获取数据。如果您的方法修改了服务器上的数据，我们建议改用[Mutations](../mutations.md)。

要订阅组件或自定义Hook中的查询，请至少使用以下命令调用 `useQuery` Hook：

- **查询的唯一键**
- 返回 Promise 的函数：
  - 解析数据，或者
  - 抛出错误

[//]: # 'Example'

```tsx
import { useQuery } from '@tanstack/react-query'

function App() {
  const info = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })
}
```

[//]: # 'Example'

您提供的**唯一查询键**在内部用于在整个应用程序中重新获取、缓存和共享您的查询。

`useQuery` 返回的查询结果包含有关模板化和任何其他数据用法所需的查询的所有信息：

[//]: # 'Example2'

```tsx
const result = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList })
```

[//]: # 'Example2'

`result` 对象包含一些非常重要的状态，您需要了解这些状态才能提高工作效率。查询在任何给定时刻只能处于以下状态之一：

- `isPending` 或 `status === 'pending'` - 查询还没有数据
- `isError` 或 `status === 'error'` - 查询遇到错误
- `isSuccess` 或`status === 'success'` - 查询成功并且数据可用

除了这些主要状态之外，还可以根据查询的状态获取更多信息：

- `error` - 如果查询处于 `isError` 状态，则可通过 `error` 属性获取错误。
- `data` - 如果查询处于 `isSuccess` 状态，则可通过 `data` 属性获取数据。
- `isFetching` - 在任何状态下，如果查询随时提取（包括后台重新获取），`isFetching` 将是`true`。

对于**大多数**查询，通常检查`isPending`状态就足够了，然后检查`isError`状态，最后，假设数据可用并呈现成功状态：

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

如果您不喜欢布尔值，您也可以随时使用 `status` 状态：

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

如果您在访问 `pending` 和 `error` 之前检查过它，TypeScript 也会正确缩小 `data` 的类型。

### 获取状态

除了 `status` 字段之外，您还将获得一个附加的 `fetchStatus` 属性，其中包含以下选项：

- `fetchStatus === 'fetching'` - 当前正在获取查询。
- `fetchStatus === 'paused'` - 查询想要获取，但已暂停。请在[Network Mode](../network-mode.md) 指南中了解更多相关信息。
- `fetchStatus === 'idle'` - 查询目前没有执行任何操作。

### 为什么是两个不同的状态？

后台重新获取和重新验证时失效逻辑使`status` 和`fetchStatus` 的所有组合成为可能。例如：

- `success` 状态的查询通常位于`idle` fetchStatus 中，但如果发生后台重新获取，它也可能位于`fetching` 中。
- 已挂载但没有数据的查询通常处于 `pending` 状态和 `fetching` fetchStatus，但如果没有网络连接，也可能是 `paused`。

因此请记住，查询可以处于 `pending` 状态，而无需实际获取数据。根据经验：

- `status` 提供了有关`data` 的信息：我们有没有？
- `fetchStatus` 提供有关 `queryFn` 的信息：它是否正在运行？

[//]: # 'Materials'

## 进一步阅读

有关执行状态检查的替代方法，请查看[Community Resources](../../community/tkdodos-blog.md#4-status-checks-in-react-query)。

[//]: # 'Materials'
