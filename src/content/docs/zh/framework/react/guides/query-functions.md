---
id: query-functions
title: 查询函数
---

<!--
translation-source-path: framework/react/guides/query-functions.md
translation-source-ref: v5.90.3
translation-source-hash: 59d0979caf356c3d88720af8e539d6ebba161369ec475668898276ea5dda2b8f
translation-status: translated
-->


查询函数本质上可以是任何**返回 Promise**的函数。返回的 Promise 应当**resolve 数据**或**抛出错误**。

以下都是有效的查询函数配置：

[//]: # 'Example'

```tsx
useQuery({ queryKey: ['todos'], queryFn: fetchAllTodos })
useQuery({ queryKey: ['todos', todoId], queryFn: () => fetchTodoById(todoId) })
useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    const data = await fetchTodoById(todoId)
    return data
  },
})
useQuery({
  queryKey: ['todos', todoId],
  queryFn: ({ queryKey }) => fetchTodoById(queryKey[1]),
})
```

[//]: # 'Example'

## 处理和抛出错误

为了让 TanStack Query 确定查询有错误，查询函数**必须抛出**或返回**rejected Promise**。查询函数中引发的任何错误都将保留在查询的 `error` 状态上。

[//]: # 'Example2'

```tsx
const { error } = useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    if (somethingGoesWrong) {
      throw new Error('Oh no!')
    }
    if (somethingElseGoesWrong) {
      return Promise.reject(new Error('Oh no!'))
    }

    return data
  },
})
```

[//]: # 'Example2'

## 与 `fetch` 和其他默认情况下不抛出异常的客户端一起使用

虽然大多数实用程序（如 `axios` 或 `graphql-request`）会针对不成功的 HTTP 调用自动引发错误，但某些实用程序（如`fetch`）默认情况下不会引发错误。如果是这种情况，您需要自己抛出错误。以下是使用流行的 `fetch` API 执行此操作的简单方法：

[//]: # 'Example3'

```tsx
useQuery({
  queryKey: ['todos', todoId],
  queryFn: async () => {
    const response = await fetch('/todos/' + todoId)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  },
})
```

[//]: # 'Example3'

## 查询函数变量

查询键不仅用于唯一标识您正在获取的数据，而且还可以作为 QueryFunctionContext 的一部分方便地传递到查询函数中。虽然并不总是必要的，但这使得可以在需要时提取查询函数：

[//]: # 'Example4'

```tsx
function Todos({ status, page }) {
  const result = useQuery({
    queryKey: ['todos', { status, page }],
    queryFn: fetchTodoList,
  })
}

// Access the key, status and page variables in your query function!
function fetchTodoList({ queryKey }) {
  const [_key, { status, page }] = queryKey
  return new Promise()
}
```

[//]: # 'Example4'

### 查询函数上下文

`QueryFunctionContext` 是传递给每个查询函数的对象。它包括：

- `queryKey: QueryKey`：[Query Keys](../query-keys.md)
- `client: QueryClient`：[QueryClient](../../../../reference/QueryClient.md)
- `signal?: AbortSignal`
  - [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) TanStack Query提供的实例
  - 可用于[Query Cancellation](../query-cancellation.md)
- `meta: Record<string, unknown> | undefined`
  - 您可以填写有关您的查询的附加信息的可选字段

此外，[Infinite Queries](../infinite-queries.md) 还传递以下选项：

- `pageParam: TPageParam`
  - 用于获取当前页面的 page 参数
- `direction: 'forward' | 'backward'`
  - **已弃用**
  - 当前页面获取的方向
  - 要访问当前页面获取的方向，请添加从`getNextPageParam` 和`getPreviousPageParam` 到`pageParam` 的方向。
