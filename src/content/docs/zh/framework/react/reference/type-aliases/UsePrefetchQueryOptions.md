---
id: UsePrefetchQueryOptions
title: UsePrefetchQueryOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/UsePrefetchQueryOptions.md
translation-source-ref: main
translation-source-hash: a677f7b5220c87b867476f9f9f25655b3ea414126ff8a6c5cd63c3bbef4b79c0
translation-status: translated
-->


```ts
type UsePrefetchQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey> = DistributiveOmit<QueryExecuteOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>, "queryFn"> & object;
```

定义于：[react-query/src/types.ts:80](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L80)

`usePrefetchQuery` 接受的选项——包含所有可传给 `queryClient.query` 的选项，
但除非已经定义默认查询函数，否则 `queryFn` 为必填项。

## 类型声明

### queryFn?

```ts
optional queryFn: Exclude<QueryExecuteOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>["queryFn"], SkipToken>;
```

这里不允许将 `skipToken` 作为值——预获取始终需要查询函数才能实际运行，
除非已经定义默认查询函数。

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

`queryFn` resolve 后得到的值的类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。

### TData

`TData` = `TQueryFnData`

`select` 执行后 `data` 的最终类型。未使用 `select` 时默认为 `TQueryFnData`。

### TQueryData

`TQueryData` = `TQueryFnData`

查询缓存中实际保存的数据类型——也就是 `select` 和 `placeholderData` 的输入类型。
它默认为 `TQueryFnData`，通常也与之相同。

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

`queryKey` 的类型。
