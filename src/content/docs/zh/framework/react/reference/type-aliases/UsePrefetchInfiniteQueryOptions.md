---
id: UsePrefetchInfiniteQueryOptions
title: UsePrefetchInfiniteQueryOptions
---

```ts
type UsePrefetchInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> = DistributiveOmit<InfiniteQueryExecuteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, "queryFn"> & object;
```

定义于：[react-query/src/types.ts:118](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L118)

`usePrefetchInfiniteQuery` 接受的选项——包含所有可传给 `queryClient.infiniteQuery` 的选项，
但除非已经定义默认查询函数，否则 `queryFn` 为必填项。

## 类型声明

### queryFn?

```ts
optional queryFn: Exclude<InfiniteQueryExecuteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>["queryFn"], SkipToken>;
```

这里不允许将 `skipToken` 作为值——预取始终需要查询函数才能实际运行，
除非已经定义默认查询函数。

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

`queryFn` resolve 后得到的单页数据类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。

### TData

`TData` = `InfiniteData`\<`TQueryFnData`\>

`select` 执行后 `data` 的最终类型。默认为 `InfiniteData<TQueryFnData>`，其结构包含所有已获取的页面
及其页面参数——预取不会再读出 `data`，因此只有当你在其他应用了 `select` 的地方复用这些选项时，
该参数才有意义。

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

`queryKey` 的类型。

### TPageParam

`TPageParam` = `unknown`

为获取指定页面而传给 `queryFn` 的参数类型。
