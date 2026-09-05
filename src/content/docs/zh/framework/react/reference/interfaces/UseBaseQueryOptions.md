---
id: UseBaseQueryOptions
title: UseBaseQueryOptions
---

定义于：[react-query/src/types.ts:47](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L47)

`useQuery` 和 `useSuspenseQuery` 共用的选项。它扩展了 `@tanstack/query-core` 中的
`QueryObserverOptions`，并增加了 `react-query` 特有的 `subscribed` 选项。

## 扩展

- `QueryObserverOptions`\<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`\>

## 类型参数

### TQueryFnData

`TQueryFnData` = `unknown`

`queryFn` 所解析出的数据类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。

### TData

`TData` = `TQueryFnData`

`select` 执行后最终得到的 `data` 类型。未使用 `select` 时，默认为 `TQueryFnData`。

### TQueryData

`TQueryData` = `TQueryFnData`

查询缓存中实际保存的数据类型——也就是传给 `select` 和 `placeholderData` 的输入类型。
它默认为 `TQueryFnData`，通常也与之相同。

### TQueryKey

`TQueryKey` *extends* `QueryKey` = `QueryKey`

`queryKey` 的类型。

## 属性

### subscribed?

```ts
optional subscribed: boolean;
```

定义于：[react-query/src/types.ts:65](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L65)

将其设为 `false`，可让此观察器取消订阅查询缓存的更新。

#### 默认值

```ts
true
```
