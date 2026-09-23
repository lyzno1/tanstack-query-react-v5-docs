---
id: TimeoutCallback
title: TimeoutCallback
---


```ts
type TimeoutCallback = (_: void) => void;
```

定义于： [packages/query-core/src/timeoutManager.ts:9](https://github.com/TanStack/query/blob/main/packages/query-core/src/timeoutManager.ts#L9)

[TimeoutManager](../interfaces/TimeoutManager.md) 不支持向回调传递参数。

`(_: void)` 是 TypeScript 对 `setTimeout(cb, number)` 默认类型定义推断出的参数类型。如果不接受一个 `void` 参数，`new Promise(resolve => timeoutManager.setTimeout(resolve, N))` 就会产生类型错误。

## 参数

### \_

`void`

## 返回值

`void`
