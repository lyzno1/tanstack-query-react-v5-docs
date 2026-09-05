---
id: UndefinedInitialDataOptions
title: UndefinedInitialDataOptions
---

```ts
type UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & object;
```

定义于：[react-query/src/queryOptions.ts:22](https://github.com/TanStack/query/blob/main/packages/react-query/src/queryOptions.ts#L22)

未设置 `initialData` 时所匹配的 `queryOptions` 重载接受的选项——查询处于 `pending` 状态时，
`data` 可能为 `undefined`。

## 类型声明

### initialData?

```ts
optional initialData:
  | InitialDataFunction<NonUndefinedGuard<TQueryFnData>>
| NonUndefinedGuard<TQueryFnData>;
```

如果设置了该值，它将作为查询缓存的初始数据（前提是该查询尚未创建或缓存）。如果设置为函数，
该函数会在共享/根查询初始化期间被调用**一次**，并且应同步返回初始数据。除非设置了 `staleTime`，
否则初始数据默认被视为已过期。`initialData` **会保存在**查询缓存中。

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

`queryFn` resolve 后得到的值的类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。

### TData

`TData` = `TQueryFnData`

`select` 执行后 `data` 的最终类型。

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

`queryKey` 的类型。
