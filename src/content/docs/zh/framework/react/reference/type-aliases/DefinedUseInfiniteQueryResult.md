---
id: DefinedUseInfiniteQueryResult
title: DefinedUseInfiniteQueryResult
---

<!--
translation-source-path: framework/react/reference/type-aliases/DefinedUseInfiniteQueryResult.md
translation-source-ref: main
translation-source-hash: 40274e06b401a64224f0db4875fb4f90fdc4da86bf6df53ec3b1d7e9497b0699
translation-status: translated
-->


```ts
type DefinedUseInfiniteQueryResult<TData, TError> = DefinedInfiniteQueryObserverResult<TData, TError>;
```

定义于：[react-query/src/types.ts:377](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L377)

设置 `initialData` 时 `useInfiniteQuery` 的结果——此时 `data` 永远不会是 `undefined`。
它重新导出了 `@tanstack/query-core` 中的 `DefinedInfiniteQueryObserverResult`。

## 类型参数

### TData

`TData` = `unknown`

`select` 执行后最终得到的 `data` 类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。
