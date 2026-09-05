---
id: UnusedSkipTokenOptions
title: UnusedSkipTokenOptions
---

```ts
type UnusedSkipTokenOptions<TQueryFnData, TError, TData, TQueryKey> = OmitKeyof<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryFn"> & object;
```

定义于：[react-query/src/queryOptions.ts:50](https://github.com/TanStack/query/blob/main/packages/react-query/src/queryOptions.ts#L50)

未设置 `initialData` 且 `queryFn` 不是 `skipToken` 时所匹配的 `queryOptions` 重载接受的选项——
它与 [UndefinedInitialDataOptions](UndefinedInitialDataOptions.md) 相同，但 `queryFn` 不能是 `skipToken`。

## 类型声明

### queryFn?

```ts
optional queryFn: Exclude<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>["queryFn"], SkipToken | undefined>;
```

这里不允许将 `skipToken` 作为值——未设置 `initialData` 时会选中此重载。如果暂时不打算运行查询，
请设置 `enabled: false`。仅省略 `queryFn` 仍会发起获取；除非 `enabled` 为 `false`，或者已经定义了
默认查询函数，否则此次获取会因 `Missing queryFn` 错误而失败。默认查询函数只负责提供 `queryFn`，
本身并不会推迟获取。

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
