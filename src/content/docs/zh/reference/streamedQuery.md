---
id: streamedQuery
title: streamedQuery
---

<!--
translation-source-path: reference/streamedQuery.md
translation-source-ref: v5.90.3
translation-source-hash: 221cd1b2d05e8d74d4fa18909ab8958e7b21c4508dd2cf8dd621225ea41342b1
translation-status: translated
-->


`streamedQuery` 是一个辅助函数，用于创建可从 [AsyncIterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncIterator) 流式读取数据的查询函数。数据会是已接收全部分块组成的数组。查询会在收到第一块数据前保持 `pending` 状态，收到后转为 `success`。在流结束前，查询会一直保持 fetchStatus 为 `fetching`。

若想查看 `streamedQuery` 的实际用法，请参考我们在 [GitHub 的 examples/react/chat 目录](https://github.com/TanStack/query/tree/main/examples/react/chat)中的聊天示例。

```tsx
import { experimental_streamedQuery as streamedQuery } from '@tanstack/react-query'

const query = queryOptions({
  queryKey: ['data'],
  queryFn: streamedQuery({
    streamFn: fetchDataInChunks,
  }),
})
```

> 注意：`streamedQuery` 目前被标记为 `experimental`，因为我们希望收集社区反馈。如果你已经试用了这个 API 并有反馈，欢迎在这个 [GitHub discussion](https://github.com/TanStack/query/discussions/9065) 中提出。

**选项**

- `streamFn: (context: QueryFunctionContext) => Promise<AsyncIterable<TData>>`
  - **必填**
  - 返回一个 Promise，Promise 的结果是包含流式数据的 AsyncIterable。
  - 会接收一个 [QueryFunctionContext](../../framework/react/guides/query-functions.md#queryfunctioncontext)
- `refetchMode?: 'append' | 'reset' | 'replace'`
  - 可选
  - 定义重新获取（refetch）的处理方式。
  - 默认为 `'reset'`
  - 设为 `'reset'` 时，查询会清空所有数据并回到 `pending` 状态。
  - 设为 `'append'` 时，数据会追加到现有数据后。
  - 设为 `'replace'` 时，流结束后会把所有数据一次性写入缓存。
- `reducer?: (accumulator: TData, chunk: TQueryFnData) => TData`
  - 可选
  - 将流式分块（`TQueryFnData`）归并为最终数据结构（`TData`）。
  - 默认行为：当 `TData` 是数组时，把每个分块追加到累加器末尾。
  - 如果 `TData` 不是数组，必须提供自定义 `reducer`。
- `initialValue?: TData = TQueryFnData`
  - 可选
  - 定义获取第一块数据期间使用的初始数据。
  - 提供自定义 `reducer` 时，此项为必填。
  - 默认为空数组。
