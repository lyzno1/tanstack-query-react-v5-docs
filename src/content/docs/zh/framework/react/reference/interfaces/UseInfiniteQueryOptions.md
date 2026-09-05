---
id: UseInfiniteQueryOptions
title: UseInfiniteQueryOptions
---

定义于：[react-query/src/types.ts:238](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L238)

`useInfiniteQuery` 接受的选项。它扩展了 `@tanstack/query-core` 中的
`InfiniteQueryObserverOptions`，增加了 `react-query` 特有的 `subscribed` 选项，同时移除了
`suspense`（`react-query` 会根据所调用的 Hook 推导该值，而不会将它作为选项暴露）。

## 扩展

- `OmitKeyof`\<`InfiniteQueryObserverOptions`\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>, `"suspense"`\>

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

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

## 属性

### subscribed?

```ts
optional subscribed: boolean;
```

定义于：[react-query/src/types.ts:259](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L259)

将其设为 `false`，可让此观察器取消订阅查询缓存的更新。

#### 默认值

```ts
true
```
