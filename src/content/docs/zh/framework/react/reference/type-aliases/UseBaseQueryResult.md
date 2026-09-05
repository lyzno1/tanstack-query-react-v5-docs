---
id: UseBaseQueryResult
title: UseBaseQueryResult
---

```ts
type UseBaseQueryResult<TData, TError> = QueryObserverResult<TData, TError>;
```

定义于：[react-query/src/types.ts:314](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L314)

未设置 `initialData` 时 `useQuery` 的结果——查询处于 `pending` 状态时，`data` 可能为 `undefined`。
它重新导出了 `@tanstack/query-core` 中的 `QueryObserverResult`。`useInfiniteQuery` 则返回
[UseInfiniteQueryResult](UseInfiniteQueryResult.md)。

## 类型参数

### TData

`TData` = `unknown`

`select` 执行后 `data` 的最终类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。
