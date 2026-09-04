---
id: query-functions
title: 查询函数
---

<!--
translation-source-path: framework/react/guides/query-functions.md
translation-source-ref: main
translation-source-hash: f5ae9a4120c8a9bbd5666774710c05f5ddcde35a7517c92230428bff666f97bb
translation-status: translated
-->


查询函数本质上可以是任何**返回 Promise**的函数。返回的 Promise 应当**resolve 数据**或**抛出错误**。

成功时，Promise 可以 resolve 为除 **`undefined`** 以外的任何值。resolve 为 `undefined` 的查询会被
[视为失败](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-react-query-4#undefined-is-an-illegal-cache-value-for-successful-queries)。
如果需要在查询缓存中以“无值”表示成功结果，请改为 resolve `null`。

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

为了让 TanStack Query 判断查询出错，查询函数**必须抛出错误**或返回 **rejected Promise**。
查询函数抛出的错误会保存在查询的 `error` 状态中。

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

虽然 `axios`、`graphql-request` 等客户端会在 HTTP 请求失败时自动抛错，但 `fetch` 等客户端默认不会。
这种情况下，需要自行抛出错误。下面展示了使用 `fetch` API 时的简单做法：

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

查询键不仅用于唯一标识正在获取的数据，还会作为 `QueryFunctionContext` 的一部分传给查询函数。虽然并非总有必要使用它，但这样可以在需要时将查询函数独立出来：

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

### `QueryFunctionContext`

`QueryFunctionContext` 是传递给每个查询函数的对象。它包括：

- `queryKey: QueryKey`：[查询键](./query-keys.md)
- `client: QueryClient`：[QueryClient](../../../reference/QueryClient.md)
- `signal?: AbortSignal`
  - TanStack Query 提供的 [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 实例
  - 可用于[查询取消](./query-cancellation.md)
- `meta: Record<string, unknown> | undefined`
  - 可用于填写查询附加信息的可选字段

此外，[无限查询](./infinite-queries.md)还会收到以下属性：

- `pageParam: TPageParam`
  - 用于获取当前页面的页面参数
- `direction: 'forward' | 'backward'`
  - **已弃用**
  - 当前页面的获取方向
  - 如需在获取当前页面时访问方向信息，请通过 `getNextPageParam` 和 `getPreviousPageParam`
    将方向加入 `pageParam`。
