---
id: UseSuspenseInfiniteQueryOptions
title: UseSuspenseInfiniteQueryOptions
---

定义于：[react-query/src/types.ts:280](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L280)

`useSuspenseInfiniteQuery` 接受的选项。它与 [UseInfiniteQueryOptions](UseInfiniteQueryOptions.md) 相同，
但移除了 `enabled`、`throwOnError` 和 `placeholderData`。Suspense Hook 无法渲染“已禁用”或“占位”状态，
因此这些选项并不适用。

## 扩展

- `OmitKeyof`\<[`UseInfiniteQueryOptions`](UseInfiniteQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>, `"queryFn"` \| `"enabled"` \| `"throwOnError"` \| `"placeholderData"`\>

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

### queryFn?

```ts
optional queryFn: QueryFunction<TQueryFnData, TQueryKey, TPageParam>;
```

定义于：[react-query/src/types.ts:294](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L294)

此处不允许使用 `skipToken`——Suspense Hook 无法渲染“已禁用”状态，因此必须始终提供查询函数，
除非已经定义了默认查询函数。

***

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

#### 继承自

```ts
OmitKeyof.subscribed
```
