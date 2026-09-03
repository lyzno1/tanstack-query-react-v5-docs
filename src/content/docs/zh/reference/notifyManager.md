---
id: NotifyManager
title: NotifyManager
redirect_from:
  - framework/react/reference/notifyManager
---

<!--
translation-source-path: reference/notifyManager.md
translation-source-ref: main
translation-source-hash: b7ec287fdc9156fe529fbd680ebe6e466478cef887a79dc36744688234f0142e
translation-status: translated
-->


`notifyManager` 负责在 TanStack Query 中调度并批处理回调。

它暴露了以下方法：

- [batch](#notifymanager-batch)
- [batchCalls](#notifymanager-batchcalls)
- [schedule](#notifymanager-schedule)
- [setNotifyFunction](#notifymanager-setnotifyfunction)
- [setBatchNotifyFunction](#notifymanager-setbatchnotifyfunction)
- [setScheduler](#notifymanager-setscheduler)

## `notifyManager.batch`

`batch` 可用于将传入回调中安排的所有更新进行批处理。
这主要在内部用于优化 Query Client 的更新。

```ts
function batch<T>(callback: () => T): T
```

## `notifyManager.batchCalls`

`batchCalls` 是一个高阶函数，接收一个回调并对其进行包装。
对包装后函数的所有调用，都会把该回调安排到下一次批处理中执行。

```ts
type BatchCallsCallback<T extends Array<unknown>> = (...args: T) => void

function batchCalls<T extends Array<unknown>>(
  callback: BatchCallsCallback<T>,
): BatchCallsCallback<T>
```

## `notifyManager.schedule`

`schedule` 会把一个函数安排到下一次批处理中运行。默认情况下，批处理
通过 `setTimeout` 运行，但可以进行配置。

```ts
function schedule(callback: () => void): void
```

## `notifyManager.setNotifyFunction`

`setNotifyFunction` 会覆盖通知函数。该函数会在回调应当执行时接收这个回调。默认的通知函数只会直接调用它。

例如，在运行测试时可用于用 `React.act` 包装通知：

```ts
import { notifyManager } from '@tanstack/react-query'
import { act } from 'react-dom/test-utils'

notifyManager.setNotifyFunction(act)
```

## `notifyManager.setBatchNotifyFunction`

`setBatchNotifyFunction` 用于设置批量更新时使用的函数。

如果你的框架支持自定义批处理函数，可以通过调用 `notifyManager.setBatchNotifyFunction` 告知 TanStack Query。

例如，在 solid-query 中会这样设置批处理函数：

```ts
import { notifyManager } from '@tanstack/query-core'
import { batch } from 'solid-js'

notifyManager.setBatchNotifyFunction(batch)
```

## `notifyManager.setScheduler`

`setScheduler` 用于配置一个自定义调度回调，决定下一次批处理何时运行。默认行为是 `setTimeout(callback, 0)`。

```ts
import { notifyManager } from '@tanstack/react-query'

// 在下一个微任务中执行批处理
notifyManager.setScheduler(queueMicrotask)

// 在下一帧渲染前执行批处理
notifyManager.setScheduler(requestAnimationFrame)

// 在未来某个时刻执行批处理
notifyManager.setScheduler((cb) => setTimeout(cb, 10))
```
