---
id: query-cancellation
title: 查询取消
---

<!--
translation-source-path: framework/react/guides/query-cancellation.md
translation-source-ref: main
translation-source-hash: fc73340be44796b9bc3fddc7c41118a199ede9749cddad2dd21c728f5a403e2b
translation-status: translated
-->


TanStack Query 会为每个查询函数提供一个 [`AbortSignal` 实例](https://developer.mozilla.org/docs/Web/API/AbortSignal)。当查询变为过期或不活跃时，该 `signal` 会被中止。因此所有查询都可以取消，你也可以按需在查询函数中响应取消操作，同时继续使用熟悉的 async/await 语法并获得自动取消能力。

大多数[运行时环境](https://developer.mozilla.org/docs/Web/API/AbortController#browser_compatibility)都支持 `AbortController` API。如果你的环境不支持，则需要提供 [polyfill](https://www.npmjs.com/search?q=abortcontroller%20polyfill)。

## 默认行为

默认情况下，如果查询在 Promise resolve 前因组件卸载而变为未使用状态，它并不会被取消。Promise resolve 后，
结果仍会写入缓存。这很有用：如果你在查询完成前卸载组件，之后再次挂载时，只要该查询尚未被垃圾回收，
就能直接使用这些数据。

但如果你消费了 `AbortSignal`，Promise 会被取消（例如中止 fetch 请求），查询也会随之取消，并将状态_还原_到先前的状态。

## 使用 `fetch`

[//]: # 'Example'

```tsx
const query = useQuery({
  queryKey: ['todos'],
  queryFn: async ({ signal }) => {
    const todosResponse = await fetch('/todos', {
      // Pass the signal to one fetch
      signal,
    })
    const todos = await todosResponse.json()

    const todoDetails = todos.map(async ({ details }) => {
      const response = await fetch(details, {
        // Or pass it to several
        signal,
      })
      return response.json()
    })

    return Promise.all(todoDetails)
  },
})
```

[//]: # 'Example'

## 使用 `axios` [v0.22.0+](https://github.com/axios/axios/releases/tag/v0.22.0)

[//]: # 'Example2'

```tsx
import axios from 'axios'

const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) =>
    axios.get('/todos', {
      // Pass the signal to `axios`
      signal,
    }),
})
```

[//]: # 'Example2'

### 使用低于 v0.22.0 的 `axios`

[//]: # 'Example3'

```tsx
import axios from 'axios'

const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) => {
    // Create a new CancelToken source for this request
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    const promise = axios.get('/todos', {
      // Pass the source token to your request
      cancelToken: source.token,
    })

    // Cancel the request if TanStack Query signals to abort
    signal?.addEventListener('abort', () => {
      source.cancel('Query was cancelled by TanStack Query')
    })

    return promise
  },
})
```

[//]: # 'Example3'

## 使用 `XMLHttpRequest`

[//]: # 'Example4'

```tsx
const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) => {
    return new Promise((resolve, reject) => {
      var oReq = new XMLHttpRequest()
      oReq.addEventListener('load', () => {
        resolve(JSON.parse(oReq.responseText))
      })
      signal?.addEventListener('abort', () => {
        oReq.abort()
        reject()
      })
      oReq.open('GET', '/todos')
      oReq.send()
    })
  },
})
```

[//]: # 'Example4'

## 使用 `graphql-request`

可以在客户端的 `request` 方法中设置 `AbortSignal`。

[//]: # 'Example5'

```tsx
const client = new GraphQLClient(endpoint)

const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) => {
    client.request({ document: query, signal })
  },
})
```

[//]: # 'Example5'

## 使用低于 v4.0.0 的 `graphql-request`

可以在 `GraphQLClient` 构造函数中设置 `AbortSignal`。

[//]: # 'Example6'

```tsx
const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) => {
    const client = new GraphQLClient(endpoint, {
      signal,
    })
    return client.request(query, variables)
  },
})
```

[//]: # 'Example6'

## 手动取消

有时可能需要手动取消查询。例如，请求耗时较长时，可以让用户点击取消按钮停止请求。为此，只需调用
`queryClient.cancelQueries({ queryKey })`；它会取消查询并将其还原到先前状态。如果查询函数消费了传入的
`signal`，TanStack Query 还会一并取消该 Promise。

[//]: # 'Example7'

```tsx
const query = useQuery({
  queryKey: ['todos'],
  queryFn: async ({ signal }) => {
    const resp = await fetch('/todos', { signal })
    return resp.json()
  },
})

const queryClient = useQueryClient()

return (
  <button
    onClick={(e) => {
      e.preventDefault()
      queryClient.cancelQueries({ queryKey: ['todos'] })
    }}
  >
    Cancel
  </button>
)
```

[//]: # 'Example7'

## 取消选项

取消选项用于控制查询取消操作的行为。

```tsx
// Cancel specific queries silently
await queryClient.cancelQueries({ queryKey: ['posts'] }, { silent: true })
```

取消选项支持以下属性：

- `silent?: boolean`
  - 设为 `true` 时，不会向观察者（例如 `onError` 回调）及相关通知传播 `CancelledError`，
    并会返回重试 Promise，而不是让 Promise reject。
  - 默认为 `false`
- `revert?: boolean`
  - 设为 `true` 时，将查询状态（数据和 status）恢复到此次进行中获取开始前的状态，
    把 `fetchStatus` 重新设为 `idle`，并且只在此前没有数据时抛错。
  - 默认为 `true`

## 局限性

[//]: # 'Limitations'

取消功能不适用于 Suspense Hook：`useSuspenseQuery`、`useSuspenseQueries` 和 `useSuspenseInfiniteQuery`。

[//]: # 'Limitations'
