---
id: MutationCacheNotifyEvent
title: MutationCacheNotifyEvent
---


```ts
type MutationCacheNotifyEvent = 
  | NotifyEventMutationAdded
  | NotifyEventMutationRemoved
  | NotifyEventMutationObserverAdded
  | NotifyEventMutationObserverRemoved
  | NotifyEventMutationObserverOptionsUpdated
  | NotifyEventMutationUpdated;
```

定义于： [packages/query-core/src/mutationCache.ts:98](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationCache.ts#L98)

传给 `MutationCache` 订阅者的事件。当缓存中添加或移除 mutation、更新其状态，或添加、移除观察者及更新观察者选项时触发。
