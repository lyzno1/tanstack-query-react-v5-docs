---
id: isCancelledError
title: isCancelledError
---


```ts
function isCancelledError(value: any): value is CancelledError;
```

定义于： [packages/query-core/src/retryer.ts:94](https://github.com/TanStack/query/blob/main/packages/query-core/src/retryer.ts#L94)

## 参数

### value

`any`

## 返回值

`value is CancelledError`

## 已弃用

请改用 `instanceof CancelledError`。
