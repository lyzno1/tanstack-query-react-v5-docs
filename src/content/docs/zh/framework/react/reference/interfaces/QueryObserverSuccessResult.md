---
id: QueryObserverSuccessResult
title: QueryObserverSuccessResult
---


定义于： [packages/query-core/src/types.ts:1017](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1017)

## 继承

- [`QueryObserverBaseResult`](QueryObserverBaseResult.md)\<`TData`, `TError`\>

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

## 属性

| 属性 | 类型 | 说明 | Overrides |
| ------ | ------ | ------ | ------ |
| <a id="data"></a> `data` | `TData` | 查询最近一次成功返回的数据。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`data`](QueryObserverBaseResult.md#data) |
| <a id="dataupdatedat"></a> `dataUpdatedAt` | `number` | 查询最近一次以 `"success"` 状态返回时的时间戳。 | - |
| <a id="error"></a> `error` | `null` | 查询抛出的错误对象；默认为 `null`。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`error`](QueryObserverBaseResult.md#error) |
| <a id="errorupdatecount"></a> `errorUpdateCount` | `number` | 错误总次数。 | - |
| <a id="errorupdatedat"></a> `errorUpdatedAt` | `number` | 查询最近一次以 `"error"` 状态返回时的时间戳。 | - |
| <a id="failurecount"></a> `failureCount` | `number` | 查询的失败次数；每次失败递增，成功时重置为 `0`。 | - |
| <a id="failurereason"></a> `failureReason` | `TError` \| `null` | 查询重试的失败原因；查询成功时重置为 `null`。 | - |
| <a id="fetchstatus"></a> `fetchStatus` | `"fetching"` \| `"paused"` \| `"idle"` | 查询的获取状态：`fetching` 表示 `queryFn` 正在执行，包括初次 `pending` 和后台重新获取；`paused` 表示本应获取但已暂停；`idle` 表示未在获取。详情参阅[网络模式](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode)。 | - |
| <a id="isenabled"></a> `isEnabled` | `boolean` | 此观察者已启用时为 `true`，否则为 `false`。 | - |
| <a id="iserror"></a> `isError` | `false` | 根据 `status` 派生的便捷布尔值；本次查询尝试出错时为 `true`。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`isError`](QueryObserverBaseResult.md#iserror) |
| <a id="isfetched"></a> `isFetched` | `boolean` | 查询曾经获取过数据时为 `true`。 | - |
| <a id="isfetchedaftermount"></a> `isFetchedAfterMount` | `boolean` | 组件挂载后查询曾获取过数据时为 `true`；可用它避免显示此前缓存的数据。 | - |
| <a id="isfetching"></a> `isFetching` | `boolean` | 根据 `fetchStatus` 派生的便捷布尔值；`queryFn` 执行期间为 `true`，包括初次 `pending` 和后台重新获取。 | - |
| <a id="isinitialloading"></a> ~~`isInitialLoading`~~ | `boolean` | **已弃用。** 请改用 `isLoading`；`isInitialLoading` 将在下一个主版本中移除。 | - |
| <a id="isloading"></a> `isLoading` | `false` | 查询首次获取正在进行时为 `true`；等同于 `isFetching && isPending`。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`isLoading`](QueryObserverBaseResult.md#isloading) |
| <a id="isloadingerror"></a> `isLoadingError` | `false` | 查询首次获取失败时为 `true`。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`isLoadingError`](QueryObserverBaseResult.md#isloadingerror) |
| <a id="ispaused"></a> `isPaused` | `boolean` | 根据 `fetchStatus` 派生的便捷布尔值；查询本应获取数据但已暂停时为 `true`。 | - |
| <a id="ispending"></a> `isPending` | `false` | 没有缓存数据且尚无查询尝试完成时，状态为 `pending`。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`isPending`](QueryObserverBaseResult.md#ispending) |
| <a id="isplaceholderdata"></a> `isPlaceholderData` | `false` | 当前显示的是占位数据时为 `true`。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`isPlaceholderData`](QueryObserverBaseResult.md#isplaceholderdata) |
| <a id="isrefetcherror"></a> `isRefetchError` | `false` | 查询重新获取失败时为 `true`。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`isRefetchError`](QueryObserverBaseResult.md#isrefetcherror) |
| <a id="isrefetching"></a> `isRefetching` | `boolean` | 后台重新获取正在进行时为 `true`，**不**包含初始 `pending`；等同于 `isFetching && !isPending`。 | - |
| <a id="isstale"></a> `isStale` | `boolean` | 缓存数据已失效，或数据已超过指定的 `staleTime` 时为 `true`。 | - |
| <a id="issuccess"></a> `isSuccess` | `true` | 根据 `status` 派生的便捷布尔值；查询收到无错误的响应且数据可显示时为 `true`。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`isSuccess`](QueryObserverBaseResult.md#issuccess) |
| <a id="refetch"></a> `refetch` | (`options?`: [`RefetchOptions`](RefetchOptions.md)) => `Promise`\<[`QueryObserverResult`](../type-aliases/QueryObserverResult.md)\<`TData`, `TError`\>\> | 手动重新获取查询的函数。 | - |
| <a id="status"></a> `status` | `"success"` | 查询状态：没有缓存数据且尚无查询尝试完成时为 `pending`；查询尝试出错时为 `error`；查询收到无错误的响应且数据可显示时为 `success`。 | [`QueryObserverBaseResult`](QueryObserverBaseResult.md).[`status`](QueryObserverBaseResult.md#status) |
