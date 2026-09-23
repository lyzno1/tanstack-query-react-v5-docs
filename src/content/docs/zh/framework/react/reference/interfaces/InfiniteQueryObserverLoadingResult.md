---
id: InfiniteQueryObserverLoadingResult
title: InfiniteQueryObserverLoadingResult
---


定义于： [packages/query-core/src/types.ts:1122](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1122)

## 继承

- [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md)\<`TData`, `TError`\>

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

## 属性

| 属性 | 类型 | 说明 | Overrides |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data` | `undefined` | 查询最近一次成功返回的数据。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`data`](InfiniteQueryObserverBaseResult.md#data) |
| <a id="dataupdatedat"></a> `dataUpdatedAt` | `number` | 查询最近一次以 `"success"` 状态返回时的时间戳。 | - |
| <a id="error"></a> `error` | `null` | 查询抛出的错误对象；默认为 `null`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`error`](InfiniteQueryObserverBaseResult.md#error) |
| <a id="errorupdatecount"></a> `errorUpdateCount` | `number` | 错误总次数。 | - |
| <a id="errorupdatedat"></a> `errorUpdatedAt` | `number` | 查询最近一次以 `"error"` 状态返回时的时间戳。 | - |
| <a id="failurecount"></a> `failureCount` | `number` | 查询的失败次数；每次失败递增，成功时重置为 `0`。 | - |
| <a id="failurereason"></a> `failureReason` | `TError` \| `null` | 查询重试的失败原因；查询成功时重置为 `null`。 | - |
| <a id="fetchnextpage"></a> `fetchNextPage` | (`options?`: [`FetchNextPageOptions`](FetchNextPageOptions.md)) => `Promise`\<[`InfiniteQueryObserverResult`](../type-aliases/InfiniteQueryObserverResult.md)\<`TData`, `TError`\>\> | 此函数用于获取结果的下一页。 | - |
| <a id="fetchpreviouspage"></a> `fetchPreviousPage` | (`options?`: [`FetchPreviousPageOptions`](FetchPreviousPageOptions.md)) => `Promise`\<[`InfiniteQueryObserverResult`](../type-aliases/InfiniteQueryObserverResult.md)\<`TData`, `TError`\>\> | 此函数用于获取结果的上一页。 | - |
| <a id="fetchstatus"></a> `fetchStatus` | `"fetching"` \| `"paused"` \| `"idle"` | 查询的获取状态：`fetching` 表示 `queryFn` 正在执行，包括初次 `pending` 和后台重新获取；`paused` 表示本应获取但已暂停；`idle` 表示未在获取。详情参阅[网络模式](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode)。 | - |
| <a id="hasnextpage"></a> `hasNextPage` | `boolean` | 存在可获取的下一页时为 `true`（由 `getNextPageParam` 判断）。 | - |
| <a id="haspreviouspage"></a> `hasPreviousPage` | `boolean` | 存在可获取的上一页时为 `true`（由 `getPreviousPageParam` 判断）。 | - |
| <a id="isenabled"></a> `isEnabled` | `boolean` | 此观察者已启用时为 `true`，否则为 `false`。 | - |
| <a id="iserror"></a> `isError` | `false` | 根据 `status` 派生的便捷布尔值；本次查询尝试出错时为 `true`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`isError`](InfiniteQueryObserverBaseResult.md#iserror) |
| <a id="isfetched"></a> `isFetched` | `boolean` | 查询曾经获取过数据时为 `true`。 | - |
| <a id="isfetchedaftermount"></a> `isFetchedAfterMount` | `boolean` | 组件挂载后查询曾获取过数据时为 `true`；可用它避免显示此前缓存的数据。 | - |
| <a id="isfetching"></a> `isFetching` | `boolean` | 根据 `fetchStatus` 派生的便捷布尔值；`queryFn` 执行期间为 `true`，包括初次 `pending` 和后台重新获取。 | - |
| <a id="isfetchingnextpage"></a> `isFetchingNextPage` | `boolean` | 通过 `fetchNextPage` 获取下一页期间为 `true`。 | - |
| <a id="isfetchingpreviouspage"></a> `isFetchingPreviousPage` | `boolean` | 通过 `fetchPreviousPage` 获取上一页期间为 `true`。 | - |
| <a id="isfetchnextpageerror"></a> `isFetchNextPageError` | `false` | 获取下一页失败时为 `true`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`isFetchNextPageError`](InfiniteQueryObserverBaseResult.md#isfetchnextpageerror) |
| <a id="isfetchpreviouspageerror"></a> `isFetchPreviousPageError` | `false` | 获取上一页失败时为 `true`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`isFetchPreviousPageError`](InfiniteQueryObserverBaseResult.md#isfetchpreviouspageerror) |
| <a id="isinitialloading"></a> ~~`isInitialLoading`~~ | `boolean` | **已弃用。** 请改用 `isLoading`；`isInitialLoading` 将在下一个主版本中移除。 | - |
| <a id="isloading"></a> `isLoading` | `true` | 查询首次获取正在进行时为 `true`；等同于 `isFetching && isPending`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`isLoading`](InfiniteQueryObserverBaseResult.md#isloading) |
| <a id="isloadingerror"></a> `isLoadingError` | `false` | 查询首次获取失败时为 `true`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`isLoadingError`](InfiniteQueryObserverBaseResult.md#isloadingerror) |
| <a id="ispaused"></a> `isPaused` | `boolean` | 根据 `fetchStatus` 派生的便捷布尔值；查询本应获取数据但已暂停时为 `true`。 | - |
| <a id="ispending"></a> `isPending` | `true` | 没有缓存数据且尚无查询尝试完成时，状态为 `pending`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`isPending`](InfiniteQueryObserverBaseResult.md#ispending) |
| <a id="isplaceholderdata"></a> `isPlaceholderData` | `false` | 当前显示的是占位数据时为 `true`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`isPlaceholderData`](InfiniteQueryObserverBaseResult.md#isplaceholderdata) |
| <a id="isrefetcherror"></a> `isRefetchError` | `false` | 查询重新获取失败时为 `true`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`isRefetchError`](InfiniteQueryObserverBaseResult.md#isrefetcherror) |
| <a id="isrefetching"></a> `isRefetching` | `boolean` | 后台重新获取正在进行时为 `true`，**不**包含初始 `pending`；等同于 `isFetching && !isPending`。 | - |
| <a id="isstale"></a> `isStale` | `boolean` | 缓存数据已失效，或数据已超过指定的 `staleTime` 时为 `true`。 | - |
| <a id="issuccess"></a> `isSuccess` | `false` | 根据 `status` 派生的便捷布尔值；查询收到无错误的响应且数据可显示时为 `true`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`isSuccess`](InfiniteQueryObserverBaseResult.md#issuccess) |
| <a id="refetch"></a> `refetch` | (`options?`: [`RefetchOptions`](RefetchOptions.md)) => `Promise`\<[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)\<`TData`, `TError`\>\> | 手动重新获取查询的函数。 | - |
| <a id="status"></a> `status` | `"pending"` | 查询状态：没有缓存数据且尚无查询尝试完成时为 `pending`；查询尝试出错时为 `error`；查询收到无错误的响应且数据可显示时为 `success`。 | [`InfiniteQueryObserverBaseResult`](InfiniteQueryObserverBaseResult.md).[`status`](InfiniteQueryObserverBaseResult.md#status) |
