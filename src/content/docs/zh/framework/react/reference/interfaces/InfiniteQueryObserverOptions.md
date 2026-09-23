---
id: InfiniteQueryObserverOptions
title: InfiniteQueryObserverOptions
---


定义于： [packages/query-core/src/types.ts:594](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L594)

## 继承

- [`QueryObserverOptions`](QueryObserverOptions.md)\<`TQueryFnData`, `TError`, `TData`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`, `TPageParam`\>.[`InfiniteQueryPageParamsOptions`](InfiniteQueryPageParamsOptions.md)\<`TQueryFnData`, `TPageParam`\>

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

`TPageParam` = `unknown`

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| ------ | ------ | ------ | ------ |
| <a id="enabled"></a> `enabled?` | \| `false` \| `true` \| (`query`: [`Query`](../classes/Query.md)\<`TQueryFnData`, `TError`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>) => `boolean` | `true` | 设为 `false`，或设为返回 `false` 的函数，可在查询挂载或查询键变化时禁用自动重新获取。若要重新获取，可调用 `useQuery` 实例返回的 `refetch`。接受布尔值或返回布尔值的函数。 |
| <a id="gctime"></a> `gcTime?` | `number` | `undefined` | 未使用或非活跃缓存数据在内存中保留的毫秒数。查询缓存变为未使用或非活跃后，会在此时间到达时被回收。若指定了不同的回收时间，采用最长的时间。设为 `Infinity` 可禁用回收。默认为 `5 * 60 * 1000`（5 分钟），SSR 期间为 `Infinity`。受 `setTimeout` 的 32 位有符号整数延迟限制，最长约为 24 天；可通过 `timeoutManager.setTimeoutProvider` 绕过。 |
| <a id="getnextpageparam"></a> `getNextPageParam` | (`lastPage`: `TQueryFnData`, `allPages`: `TQueryFnData`[], `lastPageParam`: `TPageParam`, `allPageParams`: `TPageParam`[]) => `TPageParam` \| `null` \| `undefined` | `undefined` | 可设置此函数，自动取得无限查询下一页的游标；其结果还用于判断 `hasNextPage`。 |
| <a id="getpreviouspageparam"></a> `getPreviousPageParam?` | (`firstPage`: `TQueryFnData`, `allPages`: `TQueryFnData`[], `firstPageParam`: `TPageParam`, `allPageParams`: `TPageParam`[]) => `TPageParam` \| `null` \| `undefined` | `undefined` | 可设置此函数，自动取得无限查询上一页的游标；其结果还用于判断 `hasPreviousPage`。 |
| <a id="initialdata"></a> `initialData?` | \| [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\> \| () => \| [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\> \| `undefined` | `undefined` | 设置后，只要该查询尚未创建或缓存，就会将此值用作查询缓存的初始数据。如果是函数，在共享的根查询初始化时只调用**一次**，且必须同步返回初始数据。除非设置了 `staleTime`，否则初始数据默认视为 stale。`initialData` **会写入**缓存。 |
| <a id="initialdataupdatedat"></a> `initialDataUpdatedAt?` | `number` \| () => `number` \| `undefined` | `undefined` | 设置后，以此毫秒时间戳作为 `initialData` 自身最近一次更新的时间。 |
| <a id="initialpageparam"></a> `initialPageParam` | `TPageParam` | `undefined` | 无限查询尚无页面时使用的初始页参数。获取第一页时，它会作为 `pageParam` 传给 `queryFn`；之后每一页使用 `getNextPageParam` 或 `getPreviousPageParam` 返回的值。它只在查询还没有页面时生效：已有第一页后，重新获取会使用该页自己的参数。 |
| <a id="maxpages"></a> `maxPages?` | `number` | `undefined` | 无限查询的数据中最多保留的页数。 |
| <a id="meta"></a> `meta?` | `Record`\<`string`, `unknown`\> | `undefined` | 存储在每个查询上的附加信息，可供其他位置使用。 |
| <a id="networkmode"></a> `networkMode?` | `"online"` \| `"always"` \| `"offlineFirst"` | `'online'` | 根据当前网络连接状态，控制查询是否可以运行。详情参阅[网络模式](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode)。 |
| <a id="notifyonchangeprops"></a> `notifyOnChangeProps?` | \| ( \| `"error"` \| `"data"` \| `"isError"` \| `"isPending"` \| `"isLoading"` \| `"isLoadingError"` \| `"isRefetchError"` \| `"isSuccess"` \| `"isPlaceholderData"` \| `"status"` \| `"dataUpdatedAt"` \| `"errorUpdatedAt"` \| `"failureCount"` \| `"failureReason"` \| `"errorUpdateCount"` \| `"isFetched"` \| `"isFetchedAfterMount"` \| `"isFetching"` \| `"isInitialLoading"` \| `"isPaused"` \| `"isRefetching"` \| `"isStale"` \| `"isEnabled"` \| `"refetch"` \| `"fetchStatus"` \| `"fetchNextPage"` \| `"fetchPreviousPage"` \| `"hasNextPage"` \| `"hasPreviousPage"` \| `"isFetchNextPageError"` \| `"isFetchingNextPage"` \| `"isFetchPreviousPageError"` \| `"isFetchingPreviousPage"`)[] \| `"all"` \| () => \| `"all"` \| ( \| `"error"` \| `"data"` \| `"isError"` \| `"isPending"` \| `"isLoading"` \| `"isLoadingError"` \| `"isRefetchError"` \| `"isSuccess"` \| `"isPlaceholderData"` \| `"status"` \| `"dataUpdatedAt"` \| `"errorUpdatedAt"` \| `"failureCount"` \| `"failureReason"` \| `"errorUpdateCount"` \| `"isFetched"` \| `"isFetchedAfterMount"` \| `"isFetching"` \| `"isInitialLoading"` \| `"isPaused"` \| `"isRefetching"` \| `"isStale"` \| `"isEnabled"` \| `"refetch"` \| `"fetchStatus"` \| `"fetchNextPage"` \| `"fetchPreviousPage"` \| `"hasNextPage"` \| `"hasPreviousPage"` \| `"isFetchNextPageError"` \| `"isFetchingNextPage"` \| `"isFetchPreviousPageError"` \| `"isFetchingPreviousPage"`)[] \| `undefined` | `undefined` | 设置后，仅当列出的属性变化时组件才会重新渲染。设为 `['data', 'error']` 时仅跟踪这两个属性；设为 `'all'` 时任何查询更新都会触发重新渲染；设为函数时，由函数计算要跟踪的属性列表。默认 `undefined`，此时自动跟踪属性访问，只有已跟踪的属性变化才会重新渲染。 |
| <a id="persister"></a> `persister?` | (`queryFn`: (`context`: [`QueryFunctionContext`](../type-aliases/QueryFunctionContext.md)\<`NoInfer`\<`TQueryKey`\>, `TPageParam`\>) => `TQueryFnData` \| `Promise`\<`TQueryFnData`\>, `context`: `object`, `query`: [`Query`](../classes/Query.md)) => `TQueryFnData` \| `Promise`\<`TQueryFnData`\> | `undefined` | 可将查询结果持久化到外部存储，从而不必实际调用 `queryFn`；例如可跨服务端与客户端边界保留查询数据。 |
| <a id="placeholderdata"></a> `placeholderData?` | \| [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\> \| (`previousData`: \| [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\> \| `undefined`, `previousQuery`: \| [`Query`](../classes/Query.md)\<[`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TError`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\> \| `undefined`) => \| [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\> \| `undefined` | `undefined` | 设置后，当此查询观察者仍处于初始加载状态且未提供 `initialData` 时，将此值作为占位数据。 |
| <a id="queryfn"></a> `queryFn?` | \| *typeof* [`skipToken`](../variables/skipToken.md) \| (`context`: [`QueryFunctionContext`](../type-aliases/QueryFunctionContext.md)\<`TQueryKey`, `TPageParam`\>) => `TQueryFnData` \| `Promise`\<`TQueryFnData`\> | `undefined` | 查询请求数据时使用的函数。除非通过 `queryClient.setQueryDefaults` 或 `queryClient.setDefaultOptions` 设置了默认查询函数，否则必填。接收 [QueryFunctionContext](../type-aliases/QueryFunctionContext.md)，必须返回一个 Promise，其结果为数据或抛出的错误；数据不能是 `undefined`。 |
| <a id="queryhash"></a> `queryHash?` | `string` | `undefined` | `queryKey` 经 `queryKeyHashFn`（或默认哈希函数）计算后的哈希值，内部用作实际缓存键。 |
| <a id="querykey"></a> `queryKey` | `TQueryKey` & `object` | `undefined` | 此查询使用的查询键，会计算为稳定的哈希值。详情参阅[查询键](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)。此键变化时查询会自动更新（只要 `enabled` 未设为 `false`）。 |
| <a id="querykeyhashfn"></a> `queryKeyHashFn?` | (`queryKey`: `TQueryKey`) => `string` | `undefined` | 设置后，使用此函数将 `queryKey` 哈希为字符串。 |
| <a id="refetchinterval"></a> `refetchInterval?` | \| `number` \| `false` \| (`query`: [`Query`](../classes/Query.md)\<`TQueryFnData`, `TError`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>) => `number` \| `false` \| `undefined` | `false` | 设置为数字时，查询会按该毫秒间隔持续重新获取；设置为函数时，函数根据最新数据和查询计算间隔。 |
| <a id="refetchintervalinbackground"></a> `refetchIntervalInBackground?` | `boolean` | `false` | 设为 `true` 时，标签页或窗口处于后台也会持续重新获取。 |
| <a id="refetchonmount"></a> `refetchOnMount?` | \| `boolean` \| `"always"` \| (`query`: [`Query`](../classes/Query.md)\<`TQueryFnData`, `TError`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>) => `boolean` \| `"always"` | `true` | 设为 `true` 时，数据 stale 则挂载时重新获取；设为 `false` 时，其他查询实例挂载不会触发后台重新获取；设为 `'always'` 时，挂载时始终重新获取（`staleTime: 'static'` 除外）；设为函数时，根据最新数据和查询计算是否重新获取。 |
| <a id="refetchonreconnect"></a> `refetchOnReconnect?` | \| `boolean` \| `"always"` \| (`query`: [`Query`](../classes/Query.md)\<`TQueryFnData`, `TError`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>) => `boolean` \| `"always"` | `undefined` | 设为 `true` 时，数据 stale 则重连时重新获取；设为 `false` 时重连时不获取；设为 `'always'` 时始终重新获取（`staleTime: 'static'` 除外）；设为函数时，根据最新数据和查询计算是否重新获取。默认 `true`，除非 `networkMode` 为 `'always'`。 |
| <a id="refetchonwindowfocus"></a> `refetchOnWindowFocus?` | \| `boolean` \| `"always"` \| (`query`: [`Query`](../classes/Query.md)\<`TQueryFnData`, `TError`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>) => `boolean` \| `"always"` | `true` | 设为 `true` 时，数据 stale 则窗口聚焦时重新获取；设为 `false` 时不获取；设为 `'always'` 时始终重新获取（`staleTime: 'static'` 除外）；设为函数时，根据最新数据和查询计算是否重新获取。 |
| <a id="retry"></a> `retry?` | \| `number` \| `false` \| `true` \| (`failureCount`: `number`, `error`: `TError`) => `boolean` | `undefined` | 设为 `false` 时，查询失败后默认不重试；设为 `true` 时无限重试；设为整数（如 `3`）时，失败次数达到该数值后停止重试；设为函数 `(failureCount, error) => boolean` 时，重试直到函数返回 `false`。客户端默认重试 `3` 次，服务端默认 `0` 次。 |
| <a id="retrydelay"></a> `retryDelay?` | `number` \| (`failureCount`: `number`, `error`: `TError`) => `number` | `undefined` | 此函数接收重试次数 `retryAttempt` 和实际错误，返回下次重试前等待的毫秒数。例如 `attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)` 实现指数退避，`attempt => attempt * 1000` 实现线性退避。默认采用指数退避，最长等待 30 秒。 |
| <a id="retryonmount"></a> `retryOnMount?` | \| `false` \| `true` \| (`query`: [`Query`](../classes/Query.md)\<`TQueryFnData`, `TError`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>) => `boolean` | `true` | 设为 `false` 时，有错误的查询不会在挂载时重试；设为函数时，由函数根据查询计算该值。 |
| <a id="select"></a> `select?` | (`data`: [`InfiniteData`](InfiniteData.md)) => `TData` | `undefined` | 可转换或选择查询函数返回的数据的一部分。它影响返回的 `data`，不影响查询缓存中存储的数据。仅当 `data` 变化或 `select` 函数的引用变化时才会运行；可记忆化函数以保持引用稳定。 |
| <a id="staletime"></a> `staleTime?` | \| `number` \| `"static"` \| (`query`: [`Query`](../classes/Query.md)\<`TQueryFnData`, `TError`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>) => `number` \| `"static"` | `0` | 数据被视为 stale 前的毫秒数；数据仍为 fresh 时，会从缓存中返回。 |
| <a id="structuralsharing"></a> `structuralSharing?` | `boolean` \| (`oldData`: `unknown`, `newData`: `unknown`) => `unknown` | `true` | 设为 `false` 可禁用查询结果之间的结构共享；设为接收新旧数据并返回同类型结果的函数，可自定义结构共享逻辑。 |
| <a id="suspense"></a> `suspense?` | `boolean` | `false` | 设为 `true` 时，`status === 'pending'` 会触发 Suspense，`status === 'error'` 会抛出错误。 |
| <a id="throwonerror"></a> `throwOnError?` | \| `false` \| `true` \| (`error`: `TError`, `query`: [`Query`](../classes/Query.md)\<`TQueryFnData`, `TError`, [`InfiniteData`](InfiniteData.md)\<`TQueryFnData`, `TPageParam`\>, `TQueryKey`\>) => `boolean` | `false` | 决定是否抛出错误而非设置 `error` 属性。设为 `true` 或 `suspense` 为 `true` 时，所有错误都会抛给 Error Boundary；两者都为 `false` 时，错误作为状态返回。设为函数时会接收错误和查询，应返回布尔值，决定抛给 Error Boundary（`true`）还是作为状态返回（`false`）。 |
