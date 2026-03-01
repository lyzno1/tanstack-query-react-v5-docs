---
id: query-retries
title: 查询重试
---

<!--
translation-source-path: framework/react/guides/query-retries.md
translation-source-ref: v5.90.3
translation-source-hash: 4681a0b430947210498fa3d1354c75b4ef4d088c2224a434b5ab5c559d95821e
translation-status: translated
-->


当 `useQuery` 查询失败时（即查询函数抛出错误），TanStack Query 会自动重试，前提是该请求尚未达到最大连续重试次数（默认 `3`），或提供了用于判断是否允许重试的函数。

你可以在全局级别和单个查询级别配置重试。

- 将 `retry = false` 可禁用重试。
- 将 `retry = 6` 表示失败请求最多重试 6 次，之后才暴露函数最终抛出的错误。
- 将 `retry = true` 表示对失败请求无限重试。
- 将 `retry = (failureCount, error) => ...` 可基于失败原因编写自定义重试逻辑。

[//]: # 'Info'

> 在服务端，默认重试次数是 `0`，以尽可能加快服务端渲染。

[//]: # 'Info'
[//]: # 'Example'

```tsx
import { useQuery } from '@tanstack/react-query'

// Make a specific query retry a certain number of times
const result = useQuery({
  queryKey: ['todos', 1],
  queryFn: fetchTodoListPage,
  retry: 10, // Will retry failed requests 10 times before displaying an error
})
```

[//]: # 'Example'

> 说明：在最后一次重试之前，`useQuery` 返回中 `error` 的内容会放在 `failureReason` 属性里。因此在上面的例子中，前 9 次重试（总计 10 次尝试）期间错误内容都在 `failureReason` 中；如果最后一次后仍失败，错误才会出现在 `error` 里。

## 重试延迟

默认情况下，TanStack Query 不会在请求失败后立刻重试。与常见实践一致，每次重试之间会逐步增加退避延迟。

默认 `retryDelay` 会在每次尝试时翻倍（从 `1000`ms 开始），但不会超过 30 秒：

[//]: # 'Example2'

```tsx
// Configure for all queries
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

[//]: # 'Example2'

虽然不推荐，但你当然可以在 Provider 级别或单个查询选项中覆盖 `retryDelay`（函数或数字）。如果设置为数字而不是函数，则每次重试等待时间都相同：

[//]: # 'Example3'

```tsx
const result = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
  retryDelay: 1000, // Will always wait 1000ms to retry, regardless of how many retries
})
```

[//]: # 'Example3'
