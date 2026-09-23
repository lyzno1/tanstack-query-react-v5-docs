---
id: DefinedUseInfiniteQueryResult
title: DefinedUseInfiniteQueryResult
---

```ts
type DefinedUseInfiniteQueryResult<TData, TError> = DefinedInfiniteQueryObserverResult<TData, TError>;
```

定义于： [packages/react-query/src/types.ts:378](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L378)

设置 `initialData` 时 `useInfiniteQuery` 的结果——此时 `data` 不会是 `undefined`（除非 `select` 将 `TData` 转换为包含 `undefined` 的类型）。
它重新导出了 `@tanstack/query-core` 中的 `DefinedInfiniteQueryObserverResult`。

## 类型参数

### TData

`TData` = `unknown`

`select` 执行后最终得到的 `data` 类型。

### TError

`TError` = [`DefaultError`](DefaultError.md)

`queryFn` 可能抛出的错误类型。
