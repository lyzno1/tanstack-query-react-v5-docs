---
id: TimeoutProvider
title: TimeoutProvider
---


```ts
type TimeoutProvider<TTimerId> = object;
```

定义于： [packages/query-core/src/timeoutManager.ts:28](https://github.com/TanStack/query/blob/main/packages/query-core/src/timeoutManager.ts#L28)

定时器函数的底层实现。

定时器对性能较敏感：短时间定时器（延迟不足几秒）更在意延迟，长时间定时器则可能受益于合并调度，即将截止时间相近的定时器分批处理。平台全局 `setTimeout`/`setInterval` 支持的默认 provider 不会这样做。自定义 provider 可以实现合并调度，还能支持超过全局 `setTimeout` 约 24 天上限的延迟。

## 类型参数

### TTimerId

`TTimerId` *extends* [`ManagedTimerId`](ManagedTimerId.md) = [`ManagedTimerId`](ManagedTimerId.md)

## 属性

| 属性 | 修饰符 | 类型 |
| ------ | ------ | ------ |
| <a id="clearinterval"></a> `clearInterval` | `readonly` | (`intervalId`: `TTimerId` \| `undefined`) => `void` |
| <a id="cleartimeout"></a> `clearTimeout` | `readonly` | (`timeoutId`: `TTimerId` \| `undefined`) => `void` |
| <a id="setinterval"></a> `setInterval` | `readonly` | (`callback`: [`TimeoutCallback`](TimeoutCallback.md), `delay`: `number`) => `TTimerId` |
| <a id="settimeout"></a> `setTimeout` | `readonly` | (`callback`: [`TimeoutCallback`](TimeoutCallback.md), `delay`: `number`) => `TTimerId` |
