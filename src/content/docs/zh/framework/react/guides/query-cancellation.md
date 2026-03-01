---
id: query-cancellation
title: 查询取消
---

<!--
translation-source-path: framework/react/guides/query-cancellation.md
translation-source-ref: v5.90.3
translation-source-hash: 94c7f7f523f1d2c742c86c12fe001839ffcbb0e206ef8935d1428aaf724e10ab
translation-status: translated
-->


TanStack Query 为每个查询函数提供一个[`AbortSignal` instance](https://developer.mozilla.org/docs/Web/API/AbortSignal)。当查询变得过时或不活动时，此`signal`将被中止。这意味着所有查询都是可以取消的，并且如果需要，您可以在查询函数内响应取消。最好的部分是它允许您继续使用正常的 async/await 语法，同时获得自动取消的所有好处。

`AbortController` API 在[most runtime environments](https://developer.mozilla.org/docs/Web/API/AbortController#browser_compatibility) 中可用，但如果您的运行时环境不支持它，您将需要提供一个polyfill。有[several available](https://www.npmjs.com/search?q=abortcontroller%20polyfill)。

## 默认行为

默认情况下，在解决Promise之前卸载或变为未使用的查询不会被取消。这意味着在 Promise 解决后，结果数据将在缓存中可用。如果您已开始接收查询，但随后在查询完成之前卸载了组件，这会很有帮助。如果您再次挂载该组件并且查询尚未被垃圾回收，则数据将可用。

但是，如果您使用`AbortSignal`，则 Promise 将被取消（例如中止获取），因此，查询也必须被取消。取消查询将导致其状态_恢复_到之前的状态。

## 使用`fetch`

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

### 使用`axios`版本低于v0.22.0

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

## 使用`XMLHttpRequest`

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

## 使用`graphql-request`

`AbortSignal` 可以在客户端`request` 方法中设置。

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

## 使用`graphql-request`版本低于v4.0.0

`AbortSignal` 可以在`GraphQLClient` 构造函数中设置。

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

您可能想要手动取消查询。例如，如果请求需要很长时间才能完成，您可以允许用户单击取消按钮来停止请求。为此，您只需调用`queryClient.cancelQueries({ queryKey })`，这将取消查询并将其恢复到之前的状态。如果您在查询函数中消费了传入的 `signal`，TanStack Query 还会额外取消该 Promise。

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

## `Cancel Options`

取消选项用于控制查询取消操作的行为。

```tsx
// Cancel specific queries silently
await queryClient.cancelQueries({ queryKey: ['posts'] }, { silent: true })
```

取消选项支持以下属性：

- `silent?: boolean`
  - 当设置为 `true` 时，抑制 `CancelledError` 向观察者（例如 `onError` 回调）和相关通知的传播，并返回重试Promise而不是拒绝。
  - 默认为`false`
- `revert?: boolean`
  - 当设置为`true`时，从正在进行的获取之前立即恢复查询的状态（数据和状态），将`fetchStatus`设置回`idle`，并且仅在没有先前数据的情况下抛出。
  - 默认为`true`

## 局限性

使用 `Suspense` Hook 时取消不起作用：`useSuspenseQuery`、`useSuspenseQueries` 和 `useSuspenseInfiniteQuery`。
