---
id: UndefinedInitialDataInfiniteOptions
title: UndefinedInitialDataInfiniteOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/UndefinedInitialDataInfiniteOptions.md
translation-source-ref: main
translation-source-hash: 6362073c9a81459173e0da38be809480eac9623baa0bd97b62b72bd1d1e72215
translation-status: translated
-->


```ts
type UndefinedInitialDataInfiniteOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> = UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & object;
```

定义于：[react-query/src/infiniteQueryOptions.ts:24](https://github.com/TanStack/query/blob/main/packages/react-query/src/infiniteQueryOptions.ts#L24)

未设置 `initialData` 时所匹配的 `infiniteQueryOptions` 重载接受的选项——查询处于 `pending`
状态时，`data` 可能为 `undefined`。

## 类型声明

### initialData?

```ts
optional initialData:
  | NonUndefinedGuard<InfiniteData<TQueryFnData, TPageParam>>
| InitialDataFunction<NonUndefinedGuard<InfiniteData<TQueryFnData, TPageParam>>>;
```

如果设置了该值，它将作为查询缓存的初始数据（前提是该查询尚未创建或缓存）。如果设置为函数，
该函数会在共享/根查询初始化期间被调用**一次**，并且应同步返回初始数据。除非设置了 `staleTime`，
否则初始数据默认被视为已过期。`initialData` **会被持久保存在**缓存中。

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
