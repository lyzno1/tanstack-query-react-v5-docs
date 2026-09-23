---
id: QueryCacheConfig
title: QueryCacheConfig
---


定义于： [packages/query-core/src/queryCache.ts:25](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L25)

`QueryCache` 处理的每个查询都会触发这些全局回调，无论由哪个组件或观察者发起。不同于查询可以覆盖的 `QueryClient.defaultOptions`，这些回调始终会调用。不同于 `MutationCacheConfig` 的回调，查询完成前不会等待它们的返回值。

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="onerror"></a> `onError?` | (`error`: `Error`, `query`: [`Query`](../classes/Query.md)\<`unknown`, `unknown`, `unknown`\>) => `void` | 缓存中的任一查询出错时调用。 |
| <a id="onsettled"></a> `onSettled?` | (`data`: `unknown`, `error`: `Error` \| `null`, `query`: [`Query`](../classes/Query.md)\<`unknown`, `unknown`, `unknown`\>) => `void` | 缓存中的任一查询结束时调用，不论成功或出错。 |
| <a id="onsuccess"></a> `onSuccess?` | (`data`: `unknown`, `query`: [`Query`](../classes/Query.md)\<`unknown`, `unknown`, `unknown`\>) => `void` | 缓存中的任一查询成功时调用。 |
