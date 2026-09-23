---
id: QueryOptions
title: QueryOptions
---


定义于： [packages/query-core/src/types.ts:278](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L278)

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

### TData

`TData` = `TQueryFnData`

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](../type-aliases/QueryKey.md) = [`QueryKey`](../type-aliases/QueryKey.md)

### TPageParam

`TPageParam` = `never`

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| ------ | ------ | ------ | ------ |
| <a id="gctime"></a> `gcTime?` | `number` | `undefined` | 未使用或非活跃缓存数据在内存中保留的毫秒数。查询缓存变为未使用或非活跃后，会在此时间到达时被回收。若指定了不同的回收时间，采用最长的时间。设为 `Infinity` 可禁用回收。默认为 `5 * 60 * 1000`（5 分钟），SSR 期间为 `Infinity`。受 `setTimeout` 的 32 位有符号整数延迟限制，最长约为 24 天；可通过 `timeoutManager.setTimeoutProvider` 绕过。 |
| <a id="initialdata"></a> `initialData?` | `TData` \| () => `TData` \| `undefined` | `undefined` | 设置后，只要该查询尚未创建或缓存，就会将此值用作查询缓存的初始数据。如果是函数，在共享的根查询初始化时只调用**一次**，且必须同步返回初始数据。除非设置了 `staleTime`，否则初始数据默认视为 stale。`initialData` **会写入**缓存。 |
| <a id="initialdataupdatedat"></a> `initialDataUpdatedAt?` | `number` \| () => `number` \| `undefined` | `undefined` | 设置后，以此毫秒时间戳作为 `initialData` 自身最近一次更新的时间。 |
| <a id="maxpages"></a> `maxPages?` | `number` | `undefined` | 无限查询的数据中最多保留的页数。 |
| <a id="meta"></a> `meta?` | `Record`\<`string`, `unknown`\> | `undefined` | 存储在每个查询上的附加信息，可供其他位置使用。 |
| <a id="networkmode"></a> `networkMode?` | `"online"` \| `"always"` \| `"offlineFirst"` | `'online'` | 根据当前网络连接状态，控制查询是否可以运行。详情参阅[网络模式](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode)。 |
| <a id="persister"></a> `persister?` | (`queryFn`: (`context`: [`QueryFunctionContext`](../type-aliases/QueryFunctionContext.md)\<`NoInfer`\<`TQueryKey`\>, `TPageParam`\>) => `TQueryFnData` \| `Promise`\<`TQueryFnData`\>, `context`: `object`, `query`: [`Query`](../classes/Query.md)) => `TQueryFnData` \| `Promise`\<`TQueryFnData`\> | `undefined` | 可将查询结果持久化到外部存储，从而不必实际调用 `queryFn`；例如可跨服务端与客户端边界保留查询数据。 |
| <a id="queryfn"></a> `queryFn?` | \| (`context`: [`QueryFunctionContext`](../type-aliases/QueryFunctionContext.md)\<`TQueryKey`, `TPageParam`\>) => `TQueryFnData` \| `Promise`\<`TQueryFnData`\> \| *typeof* [`skipToken`](../variables/skipToken.md) | `undefined` | 查询请求数据时使用的函数。除非通过 `queryClient.setQueryDefaults` 或 `queryClient.setDefaultOptions` 设置了默认查询函数，否则必填。接收 [QueryFunctionContext](../type-aliases/QueryFunctionContext.md)，必须返回一个 Promise，其结果为数据或抛出的错误；数据不能是 `undefined`。 |
| <a id="queryhash"></a> `queryHash?` | `string` | `undefined` | `queryKey` 经 `queryKeyHashFn`（或默认哈希函数）计算后的哈希值，内部用作实际缓存键。 |
| <a id="querykey"></a> `queryKey?` | `TQueryKey` | `undefined` | 此查询使用的查询键，会计算为稳定的哈希值。详情参阅[查询键](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)。此键变化时查询会自动更新（只要 `enabled` 未设为 `false`）。 |
| <a id="querykeyhashfn"></a> `queryKeyHashFn?` | (`queryKey`: `TQueryKey`) => `string` | `undefined` | 设置后，使用此函数将 `queryKey` 哈希为字符串。 |
| <a id="retry"></a> `retry?` | \| `number` \| `false` \| `true` \| (`failureCount`: `number`, `error`: `TError`) => `boolean` | `undefined` | 设为 `false` 时，查询失败后默认不重试；设为 `true` 时无限重试；设为整数（如 `3`）时，失败次数达到该数值后停止重试；设为函数 `(failureCount, error) => boolean` 时，重试直到函数返回 `false`。客户端默认重试 `3` 次，服务端默认 `0` 次。 |
| <a id="retrydelay"></a> `retryDelay?` | `number` \| (`failureCount`: `number`, `error`: `TError`) => `number` | `undefined` | 此函数接收重试次数 `retryAttempt` 和实际错误，返回下次重试前等待的毫秒数。例如 `attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)` 实现指数退避，`attempt => attempt * 1000` 实现线性退避。默认采用指数退避，最长等待 30 秒。 |
| <a id="structuralsharing"></a> `structuralSharing?` | `boolean` \| (`oldData`: `unknown`, `newData`: `unknown`) => `unknown` | `true` | 设为 `false` 可禁用查询结果之间的结构共享；设为接收新旧数据并返回同类型结果的函数，可自定义结构共享逻辑。 |
