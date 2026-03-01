---
id: NotifyManager
title: NotifyManager
---

<!--
translation-source-path: reference/notifyManager.md
translation-source-ref: v5.90.3
translation-source-hash: ec4f118c66a4d7e08f781e3260bf5a40459b9f0a2b5d0fb2701b57a4914652df
translation-status: translated
-->


`notifyManager` 负责在 TanStack Query 中调度并批处理回调。

它暴露了以下方法：

- [batch](#notifymanagerbatch)
- [batchCalls](#notifymanagerbatchcalls)
- [schedule](#notifymanagerschedule)
- [setNotifyFunction](#notifymanagersetnotifyfunction)
- [setBatchNotifyFunction](#notifymanagersetbatchnotifyfunction)
- [setScheduler](#notifymanagersetscheduler)

## `notifyManager.batch`

`batch` 可用于将传入回调中安排的所有更新进行批处理。
这主要用于内部优化 queryClient 的更新。

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

`setNotifyFunction` 会覆盖通知函数。该函数会接收应被执行的
callback。默认的 notifyFunction 只是直接调用它。

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

`setScheduler` 用于配置一个自定义回调，以决定下一次批处理
何时运行。默认行为是 `setTimeout(callback, 0)`。

```ts
import { notifyManager } from '@tanstack/react-query'

// Schedule batches in the next microtask
notifyManager.setScheduler(queueMicrotask)

// Schedule batches before the next frame is rendered
notifyManager.setScheduler(requestAnimationFrame)

// Schedule batches some time in the future
notifyManager.setScheduler((cb) => setTimeout(cb, 10))
```
