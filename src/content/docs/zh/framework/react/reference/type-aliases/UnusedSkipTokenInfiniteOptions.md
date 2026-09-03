---
id: UnusedSkipTokenInfiniteOptions
title: UnusedSkipTokenInfiniteOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/UnusedSkipTokenInfiniteOptions.md
translation-source-ref: main
translation-source-hash: a4f73272943c769a20c67a7f0fb1d1c0438a952180a86034cce7c20f537013bb
translation-status: translated
-->


```ts
type UnusedSkipTokenInfiniteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> = OmitKeyof<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, "queryFn"> & object;
```

定义于：[react-query/src/infiniteQueryOptions.ts:64](https://github.com/TanStack/query/blob/main/packages/react-query/src/infiniteQueryOptions.ts#L64)

未设置 `initialData` 且 `queryFn` 不是 `skipToken` 时所匹配的 `infiniteQueryOptions` 重载接受的选项——
它与 [UndefinedInitialDataInfiniteOptions](UndefinedInitialDataInfiniteOptions.md) 相同，但 `queryFn` 不能是 `skipToken`。

## 类型声明

### queryFn?

```ts
optional queryFn: Exclude<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>["queryFn"], SkipToken | undefined>;
```

这里不允许将 `skipToken` 作为值——未设置 `initialData` 时会选中此重载。如果暂时不打算运行查询，
请设置 `enabled: false`。仅省略 `queryFn` 仍会发起获取；除非 `enabled` 为 `false`，或者已经定义了
默认查询函数，否则此次获取会因 `Missing queryFn` 错误而失败。默认查询函数只负责提供 `queryFn`，
本身并不会推迟获取。

## 类型参数

### TQueryFnData

`TQueryFnData`

`queryFn` resolve 后得到的单页数据类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。

### TData

`TData` = `InfiniteData`\<`TQueryFnData`\>

`select` 执行后 `data` 的最终类型——默认为 `InfiniteData<TQueryFnData>`，
其结构包含所有已获取的页面及其页面参数。

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

`queryKey` 的类型。

### TPageParam

`TPageParam` = `unknown`

为获取指定页面而传给 `queryFn` 的参数类型。
