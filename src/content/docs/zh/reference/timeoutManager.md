---
id: TimeoutManager
title: TimeoutManager
---

<!--
translation-source-path: reference/timeoutManager.md
translation-source-ref: v5.90.3
translation-source-hash: 2a2f970daa130ed0f76c118fc85193f51266a87614f742fd55b837d48b62431e
translation-status: translated
-->


`TimeoutManager` 负责处理 TanStack Query 中的 `setTimeout` 和 `setInterval` 计时器。

TanStack Query 使用计时器来实现查询 `staleTime`、`gcTime` 等功能，以及重试、节流和防抖。

默认情况下，TimeoutManager 使用全局 `setTimeout` 与 `setInterval`，但也可以配置为使用自定义实现。

可用方法如下：

- [`timeoutManager.setTimeoutProvider`](#timeoutmanagersettimeoutprovider)
  - [`TimeoutProvider`](#timeoutprovider)
- [`timeoutManager.setTimeout`](#timeoutmanagersettimeout)
- [`timeoutManager.clearTimeout`](#timeoutmanagercleartimeout)
- [`timeoutManager.setInterval`](#timeoutmanagersetinterval)
- [`timeoutManager.clearInterval`](#timeoutmanagerclearinterval)

## `timeoutManager.setTimeoutProvider`

`setTimeoutProvider` 可用于设置 `setTimeout`、`clearTimeout`、`setInterval`、`clearInterval` 的自定义实现，这个实现称为 `TimeoutProvider`。

如果你在数千个查询场景下观察到事件循环性能问题，这会很有帮助。自定义 TimeoutProvider 也可以支持比全局 `setTimeout` 最大延迟（约 [24 天](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#maximum_delay_value)）更长的计时。

务必在创建 QueryClient 或查询之前调用 `setTimeoutProvider`，以便应用中所有计时器都一致地使用同一 provider，因为不同 TimeoutProvider 之间无法互相取消对方的计时器。

```tsx
import { timeoutManager, QueryClient } from '@tanstack/react-query'
import { CustomTimeoutProvider } from './CustomTimeoutProvider'

timeoutManager.setTimeoutProvider(new CustomTimeoutProvider())

export const queryClient = new QueryClient()
```

### `TimeoutProvider`

计时器对性能非常敏感。短时计时器（例如延迟小于 5 秒）通常更关注延迟；而长时计时器可能更适合使用[计时器合并](https://en.wikipedia.org/wiki/Timer_coalescing)（把截止时间相近的计时器批量处理），并配合类似[分层时间轮](https://www.npmjs.com/package/timer-wheel)的数据结构。

`TimeoutProvider` 类型要求实现能够处理可通过 [Symbol.toPrimitive][toPrimitive] 转换为 `number` 的计时器 ID 对象，因为 NodeJS 这类运行时的全局 `setTimeout` 和 `setInterval` 会返回[对象][nodejs-timeout]。TimeoutProvider 实现可以在内部将计时器 ID 强制转换为 number，也可以返回自定义对象类型，只要其实现了 `{ [Symbol.toPrimitive]: () => number }`。

[nodejs-timeout]: https://nodejs.org/api/timers.html#class-timeout
[toPrimitive]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive

```tsx
type ManagedTimerId = number | { [Symbol.toPrimitive]: () => number }

type TimeoutProvider<TTimerId extends ManagedTimerId = ManagedTimerId> = {
  readonly setTimeout: (callback: TimeoutCallback, delay: number) => TTimerId
  readonly clearTimeout: (timeoutId: TTimerId | undefined) => void

  readonly setInterval: (callback: TimeoutCallback, delay: number) => TTimerId
  readonly clearInterval: (intervalId: TTimerId | undefined) => void
}
```

## `timeoutManager.setTimeout`

`setTimeout(callback, delayMs)` 会像全局 [setTimeout function](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) 一样，在大约 `delay` 毫秒后调度回调执行。该回调可通过 `timeoutManager.clearTimeout` 取消。

它会返回一个计时器 ID，可能是 number，也可能是可通过 [Symbol.toPrimitive][toPrimitive] 强制转换为 number 的对象。

```tsx
import { timeoutManager } from '@tanstack/react-query'

const timeoutId = timeoutManager.setTimeout(
  () => console.log('ran at:', new Date()),
  1000,
)

const timeoutIdNumber: number = Number(timeoutId)
```

## `timeoutManager.clearTimeout`

`clearTimeout(timerId)` 会像全局 [clearTimeout function](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout) 一样，取消由 `setTimeout` 安排的回调。应传入 `timeoutManager.setTimeout` 返回的计时器 ID。

```tsx
import { timeoutManager } from '@tanstack/react-query'

const timeoutId = timeoutManager.setTimeout(
  () => console.log('ran at:', new Date()),
  1000,
)

timeoutManager.clearTimeout(timeoutId)
```

## `timeoutManager.setInterval`

`setInterval(callback, intervalMs)` 会像全局 [setInterval function](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval) 一样，大约每 `intervalMs` 调度一次回调。

与 `setTimeout` 一样，它会返回一个计时器 ID，可能是 number，也可能是可通过 [Symbol.toPrimitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) 强制转换为 number 的对象。

```tsx
import { timeoutManager } from '@tanstack/react-query'

const intervalId = timeoutManager.setInterval(
  () => console.log('ran at:', new Date()),
  1000,
)
```

## `timeoutManager.clearInterval`

`clearInterval(intervalId)` 可用于取消一个 interval，就像全局 [clearInterval function](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval) 一样。应传入 `timeoutManager.setInterval` 返回的 interval ID。

```tsx
import { timeoutManager } from '@tanstack/react-query'

const intervalId = timeoutManager.setInterval(
  () => console.log('ran at:', new Date()),
  1000,
)

timeoutManager.clearInterval(intervalId)
```
