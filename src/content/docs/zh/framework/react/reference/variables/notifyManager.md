---
id: notifyManager
title: notifyManager
redirect_from:
  - reference/notifyManager
  - framework/react/reference/notifyManager
---


```ts
const notifyManager: object;
```

定义于： [packages/query-core/src/notifyManager.ts:144](https://github.com/TanStack/query/blob/main/packages/query-core/src/notifyManager.ts#L144)

管理 TanStack Query 中回调的调度和批处理。

## 类型声明

### batch()

```ts
readonly batch: <T>(callback: () => T) => T;
```

将传入回调中调度的所有更新合并为一批。主要用于内部优化 Query Client 的更新。批处理可以嵌套；最外层 `batch` 调用完成后才会清空队列。`callback` 的返回值会原样返回。

#### 类型参数

##### T

`T`

#### 参数

##### callback

() => `T`

#### 返回值

`T`

### batchCalls()

```ts
readonly batchCalls: <T>(callback: BatchCallsCallback<T>) => BatchCallsCallback<T>;
```

包装后的函数每次调用都会参与批处理。

#### 类型参数

##### T

`T` *extends* `unknown`[]

#### 参数

##### callback

`BatchCallsCallback`\<`T`\>

#### 返回值

`BatchCallsCallback`\<`T`\>

### schedule()

```ts
schedule: (callback: NotifyCallback) => void;
```

安排函数在下一批执行。默认使用 `setTimeout` 执行批处理，可通过 `setScheduler` 配置。

#### 参数

##### callback

`NotifyCallback`

#### 返回值

`void`

### setBatchNotifyFunction()

```ts
readonly setBatchNotifyFunction: (fn: BatchNotifyFunction) => void;
```

用此方法设置自定义函数，将通知合并到同一个事件循环轮次。框架适配器借此接入各自的批处理机制，使一次查询更新只触发一次重新渲染，而非每个订阅者各触发一次。

#### 参数

##### fn

`BatchNotifyFunction`

#### 返回值

`void`

#### 示例

```ts
import { notifyManager } from '@tanstack/query-core'
import { batch } from 'solid-js'

notifyManager.setBatchNotifyFunction(batch)
```

### setNotifyFunction()

```ts
readonly setNotifyFunction: (fn: NotifyFunction) => void;
```

用此方法设置自定义通知函数。例如，在测试中可用 `React.act` 包装通知。

#### 参数

##### fn

`NotifyFunction`

#### 返回值

`void`

### setScheduler()

```ts
readonly setScheduler: (fn: ScheduleFunction) => void;
```

配置一个自定义回调，用来调度下一批执行的时机。默认行为是 `setTimeout(callback, 0)`。

#### 参数

##### fn

`ScheduleFunction`

#### 返回值

`void`

#### 示例

```ts
import { notifyManager } from '@tanstack/query-core'

// Schedule batches in the next microtask
notifyManager.setScheduler(queueMicrotask)

// Schedule batches before the next frame is rendered
notifyManager.setScheduler(requestAnimationFrame)

// Schedule batches some time in the future
notifyManager.setScheduler((cb) => setTimeout(cb, 10))
```
