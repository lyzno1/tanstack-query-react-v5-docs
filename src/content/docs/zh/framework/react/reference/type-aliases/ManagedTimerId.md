---
id: ManagedTimerId
title: ManagedTimerId
---


```ts
type ManagedTimerId = 
  | number
  | {
  [toPrimitive]: () => number;
};
```

定义于： [packages/query-core/src/timeoutManager.ts:17](https://github.com/TanStack/query/blob/main/packages/query-core/src/timeoutManager.ts#L17)

从类型角度看，封装 `setTimeout` 比较棘手，因为平台类型定义可能扩展其返回类型。例如，Node.js 类型定义会加入 `NodeJS.Timeout`，而自定义 `timeoutManager` 未必能返回这一类型。
