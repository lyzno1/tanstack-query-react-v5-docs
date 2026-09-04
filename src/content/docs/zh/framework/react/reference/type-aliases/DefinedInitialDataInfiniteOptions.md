---
id: DefinedInitialDataInfiniteOptions
title: DefinedInitialDataInfiniteOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/DefinedInitialDataInfiniteOptions.md
translation-source-ref: main
translation-source-hash: e95fca4081a6b37e29d2123ad047b7fc6e9f0e6bbc040977fb25519c305959e5
translation-status: translated
-->


```ts
type DefinedInitialDataInfiniteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> = UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & object;
```

定义于：[react-query/src/infiniteQueryOptions.ts:103](https://github.com/TanStack/query/blob/main/packages/react-query/src/infiniteQueryOptions.ts#L103)

设置 `initialData` 时所选中的 `infiniteQueryOptions` 重载接受的选项——此时 `data` 永远不会是 `undefined`。

## 类型声明

### initialData

```ts
initialData:
  | NonUndefinedGuard<InfiniteData<TQueryFnData, TPageParam>>
  | () => NonUndefinedGuard<InfiniteData<TQueryFnData, TPageParam>>
  | undefined;
```

如果设置了此项，只要该查询尚未创建或缓存，其值就会用作查询缓存的初始数据。如果传入函数，
该函数会在共享/根查询初始化期间调用**一次**，并且应当同步返回初始数据。除非设置了 `staleTime`，
否则初始数据默认视为过期。`initialData` **会持久保存在**缓存中。

## 类型参数

### TQueryFnData

`TQueryFnData`

`queryFn` 所解析出的单页数据类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。

### TData

`TData` = `InfiniteData`\<`TQueryFnData`\>

`select` 执行后最终得到的 `data` 类型。默认为 `InfiniteData<TQueryFnData>`，其结构包含
所有已获取的页面及其页面参数。

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

`queryKey` 的类型。

### TPageParam

`TPageParam` = `unknown`

为获取指定页面而传给 `queryFn` 的参数类型。
