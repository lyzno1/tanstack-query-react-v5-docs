---
id: QueryState
title: QueryState
---


定义于： [packages/query-core/src/query.ts:52](https://github.com/TanStack/query/blob/main/packages/query-core/src/query.ts#L52)

存储在 `Query` 实例上的原始状态；观察者结果（如 `QueryObserverResult`）由此派生。

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="data"></a> `data` | `TData` \| `undefined` | 查询最近一次成功返回的数据。 |
| <a id="dataupdatecount"></a> `dataUpdateCount` | `number` | 查询成功返回的次数。 |
| <a id="dataupdatedat"></a> `dataUpdatedAt` | `number` | 查询最近一次以 `"success"` 状态返回时的时间戳。 |
| <a id="error"></a> `error` | `TError` \| `null` | 如果最近一次尝试出错，记录查询的错误对象；默认为 `null`。 |
| <a id="errorupdatecount"></a> `errorUpdateCount` | `number` | 错误总次数；查询每次因错误结束时递增。 |
| <a id="errorupdatedat"></a> `errorUpdatedAt` | `number` | 查询最近一次以 `"error"` 状态返回时的时间戳。 |
| <a id="fetchfailurecount"></a> `fetchFailureCount` | `number` | 当前获取过程的失败次数；每次失败递增，获取成功时重置为 `0`。 |
| <a id="fetchfailurereason"></a> `fetchFailureReason` | `TError` \| `null` | 重试器报告的当前获取过程失败原因；获取成功时重置为 `null`。 |
| <a id="fetchmeta"></a> `fetchMeta` | `FetchMeta` \| `null` | 传给当前正在进行（或最近一次）获取的元数据，例如无限查询中 `fetchMore` 的方向。 |
| <a id="fetchstatus"></a> `fetchStatus` | `"fetching"` \| `"paused"` \| `"idle"` | 查询的获取状态：`fetching` 表示 `queryFn` 正在执行；`paused` 表示本应获取但已暂停（参见网络模式）；`idle` 表示未在获取。 |
| <a id="isinvalidated"></a> `isInvalidated` | `boolean` | 查询是否已通过 `invalidate()` 标记为失效；查询成功返回时重置为 `false`。 |
| <a id="status"></a> `status` | `"error"` \| `"pending"` \| `"success"` | 查询状态：没有缓存数据且尚无尝试完成时为 `pending`；最近一次尝试出错时为 `error`；已有查询数据时为 `success`。 |
