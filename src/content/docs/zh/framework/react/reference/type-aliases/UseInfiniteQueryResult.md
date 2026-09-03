---
id: UseInfiniteQueryResult
title: UseInfiniteQueryResult
---

<!--
translation-source-path: framework/react/reference/type-aliases/UseInfiniteQueryResult.md
translation-source-ref: main
translation-source-hash: 71117f81f16e404522967fe5c8877054d61680f6699cb1815504e7082632f875
translation-status: translated
-->


```ts
type UseInfiniteQueryResult<TData, TError> = InfiniteQueryObserverResult<TData, TError>;
```

定义于：[react-query/src/types.ts:365](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L365)

未设置 `initialData` 时 `useInfiniteQuery` 的结果——查询处于 `pending` 状态时，`data` 可能为
`undefined`。它重新导出了 `@tanstack/query-core` 中的 `InfiniteQueryObserverResult`。

## 类型参数

### TData

`TData` = `unknown`

`select` 执行后 `data` 的最终类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。
