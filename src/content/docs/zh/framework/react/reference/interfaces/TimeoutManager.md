---
id: TimeoutManager
title: TimeoutManager
redirect_from:
  - reference/timeoutManager
---


定义于： [packages/query-core/src/timeoutManager.ts:70](https://github.com/TanStack/query/blob/main/packages/query-core/src/timeoutManager.ts#L70)

用于自定义定时器的创建方式。`@tanstack/query-core` 广泛使用定时器来实现 `staleTime` 和 `gcTime`。默认 `TimeoutManager` provider 使用平台全局的 `setTimeout`；当事件循环中有数千个定时器时，这种实现可能遇到扩展性问题。若遇到该限制，可以提供合并调度定时器的自定义 `TimeoutProvider`。

## 实现

- `Omit`\<[`TimeoutProvider`](../type-aliases/TimeoutProvider.md), `"name"`\>

## 方法

### clearInterval()

```ts
clearInterval(intervalId: ManagedTimerId | undefined): void;
```

定义于： [packages/query-core/src/timeoutManager.ts:224](https://github.com/TanStack/query/blob/main/packages/query-core/src/timeoutManager.ts#L224)

`clearInterval` 与全局同名函数一样，用于取消周期定时器。应传入 `setInterval` 返回的 ID。

#### 参数

##### intervalId

[`ManagedTimerId`](../type-aliases/ManagedTimerId.md) | `undefined`

#### 返回值

`void`

#### 示例

```ts
import { timeoutManager } from '@tanstack/query-core'

const intervalId = timeoutManager.setInterval(
  () => console.log('ran at:', new Date()),
  1000,
)

timeoutManager.clearInterval(intervalId)
```

#### 实现自

[`TimeoutProvider`](../type-aliases/TimeoutProvider.md).[`clearInterval`](../type-aliases/TimeoutProvider.md#clearinterval)

***

### clearTimeout()

```ts
clearTimeout(timeoutId: ManagedTimerId | undefined): void;
```

定义于： [packages/query-core/src/timeoutManager.ts:179](https://github.com/TanStack/query/blob/main/packages/query-core/src/timeoutManager.ts#L179)

`clearTimeout` 与全局同名函数一样，用于取消 `setTimeout` 调度的回调。应传入 `setTimeout` 返回的定时器 ID。

#### 参数

##### timeoutId

[`ManagedTimerId`](../type-aliases/ManagedTimerId.md) | `undefined`

#### 返回值

`void`

#### 示例

```ts
import { timeoutManager } from '@tanstack/query-core'

const timeoutId = timeoutManager.setTimeout(
  () => console.log('ran at:', new Date()),
  1000,
)

timeoutManager.clearTimeout(timeoutId)
```

#### 实现自

[`TimeoutProvider`](../type-aliases/TimeoutProvider.md).[`clearTimeout`](../type-aliases/TimeoutProvider.md#cleartimeout)

***

### setInterval()

```ts
setInterval(callback: TimeoutCallback, delay: number): ManagedTimerId;
```

定义于： [packages/query-core/src/timeoutManager.ts:200](https://github.com/TanStack/query/blob/main/packages/query-core/src/timeoutManager.ts#L200)

`setInterval` 与全局同名函数一样，大约每隔 `delay` 毫秒调度一次回调。与 `setTimeout` 一样，它返回定时器 ID；该 ID 可以是数字，也可以是通过 `Symbol.toPrimitive` 转换为数字的对象。

#### 参数

##### callback

[`TimeoutCallback`](../type-aliases/TimeoutCallback.md)

##### delay

`number`

#### 返回值

[`ManagedTimerId`](../type-aliases/ManagedTimerId.md)

#### 示例

```ts
import { timeoutManager } from '@tanstack/query-core'

const intervalId = timeoutManager.setInterval(
  () => console.log('ran at:', new Date()),
  1000,
)
```

#### 实现自

[`TimeoutProvider`](../type-aliases/TimeoutProvider.md).[`setInterval`](../type-aliases/TimeoutProvider.md#setinterval)

***

### setTimeout()

```ts
setTimeout(callback: TimeoutCallback, delay: number): ManagedTimerId;
```

定义于： [packages/query-core/src/timeoutManager.ts:155](https://github.com/TanStack/query/blob/main/packages/query-core/src/timeoutManager.ts#L155)

`setTimeout` 与全局同名函数一样，在大约 `delay` 毫秒后调度回调。可用 `clearTimeout` 取消。它返回定时器 ID；该 ID 可以是数字，也可以是通过 `Symbol.toPrimitive` 转换为数字的对象。

#### 参数

##### callback

[`TimeoutCallback`](../type-aliases/TimeoutCallback.md)

##### delay

`number`

#### 返回值

[`ManagedTimerId`](../type-aliases/ManagedTimerId.md)

#### 示例

```ts
import { timeoutManager } from '@tanstack/query-core'

const timeoutId = timeoutManager.setTimeout(
  () => console.log('ran at:', new Date()),
  1000,
)

const timeoutIdNumber: number = Number(timeoutId)
```

#### 实现自

[`TimeoutProvider`](../type-aliases/TimeoutProvider.md).[`setTimeout`](../type-aliases/TimeoutProvider.md#settimeout)

***

### setTimeoutProvider()

```ts
setTimeoutProvider<TTimerId>(provider: TimeoutProvider<TTimerId>): void;
```

定义于： [packages/query-core/src/timeoutManager.ts:106](https://github.com/TanStack/query/blob/main/packages/query-core/src/timeoutManager.ts#L106)

`setTimeoutProvider` 用于设置 `setTimeout`、`clearTimeout`、`setInterval`、`clearInterval` 的自定义实现，即 `TimeoutProvider`。当数千个查询导致事件循环性能问题时，它可能有所帮助；还可以支持超过全局 `setTimeout` 约 24 天上限的延迟。务必在创建 `QueryClient` 或查询之前调用 `setTimeoutProvider`，以确保应用中的所有定时器始终使用同一个 provider：不同 provider 无法相互取消定时器。

#### 类型参数

##### TTimerId

`TTimerId` *extends* [`ManagedTimerId`](../type-aliases/ManagedTimerId.md)

#### 参数

##### provider

[`TimeoutProvider`](../type-aliases/TimeoutProvider.md)\<`TTimerId`\>

#### 返回值

`void`

#### 示例

```ts
import { timeoutManager, QueryClient } from '@tanstack/query-core'
import { CustomTimeoutProvider } from './CustomTimeoutProvider'

timeoutManager.setTimeoutProvider(new CustomTimeoutProvider())

export const queryClient = new QueryClient()
```
