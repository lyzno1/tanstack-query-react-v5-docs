---
id: QueryCacheNotifyEvent
title: QueryCacheNotifyEvent
---


```ts
type QueryCacheNotifyEvent = 
  | NotifyEventQueryAdded
  | NotifyEventQueryRemoved
  | NotifyEventQueryUpdated
  | NotifyEventQueryObserverAdded
  | NotifyEventQueryObserverRemoved
  | NotifyEventQueryObserverResultsUpdated
  | NotifyEventQueryObserverOptionsUpdated;
```

定义于： [packages/query-core/src/queryCache.ts:85](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryCache.ts#L85)

传给 `QueryCache` 订阅者的事件。当缓存中添加或移除查询、更新查询状态（例如通过 `query.setState` 或 `queryClient.removeQueries`），或添加、移除观察者及更新观察者的结果或选项时触发。
