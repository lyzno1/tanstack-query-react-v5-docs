---
id: DefinedInitialDataOptions
title: DefinedInitialDataOptions
---

<!--
translation-source-path: framework/react/reference/type-aliases/DefinedInitialDataOptions.md
translation-source-ref: main
translation-source-hash: 3f143bb6ca8902c7ce975541f885d4ef70cdfdc5411655cb6c5af0792030e422
translation-status: translated
-->


```ts
type DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryFn"> & object;
```

定义于：[react-query/src/queryOptions.ts:80](https://github.com/TanStack/query/blob/main/packages/react-query/src/queryOptions.ts#L80)

设置 `initialData` 时所选中的 `queryOptions` 重载接受的选项——此时 `data` 永远不会是 `undefined`。

## 类型声明

### initialData

```ts
initialData:
  | NonUndefinedGuard<TQueryFnData>
| () => NonUndefinedGuard<TQueryFnData>;
```

如果设置了此项，只要该查询尚未创建或缓存，其值就会用作查询缓存的初始数据。如果传入函数，
该函数会在共享/根查询初始化期间调用**一次**，并且应当同步返回初始数据。除非设置了 `staleTime`，
否则初始数据默认视为过期。`initialData` **会持久保存在**缓存中。

### queryFn?

```ts
optional queryFn: QueryFunction<TQueryFnData, TQueryKey>;
```

此处为可选项，但只有在不会发起获取时才能安全省略，例如设置了 `enabled: false`，或已经定义默认查询函数。
否则，已启用但没有 `queryFn` 的查询仍会尝试获取，并因 `Missing queryFn` 错误而失败；`initialData` 无法阻止这一行为。

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

`queryFn` 所解析出的数据类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。

### TData

`TData` = `TQueryFnData`

`select` 执行后最终得到的 `data` 类型。

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

`queryKey` 的类型。
