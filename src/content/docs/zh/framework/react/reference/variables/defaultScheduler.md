---
id: defaultScheduler
title: defaultScheduler
---


```ts
const defaultScheduler: ScheduleFunction = systemSetTimeoutZero;
```

定义于： [packages/query-core/src/notifyManager.ts:19](https://github.com/TanStack/query/blob/main/packages/query-core/src/notifyManager.ts#L19)

通知管理器使用的默认调度函数，通过系统的 `setTimeout(callback, 0)` 调度回调。
