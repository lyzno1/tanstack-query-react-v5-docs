---
id: UseQueryOptions
title: UseQueryOptions
---

<!--
translation-source-path: framework/react/reference/interfaces/UseQueryOptions.md
translation-source-ref: main
translation-source-hash: b62081549fd45ec51bbdc2f1f1e36a01b339c884af1e74708033c170887efd31
translation-status: translated
-->


定义于：[react-query/src/types.ts:165](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L165)

`useQuery` 接受的选项。它与 [UseBaseQueryOptions](UseBaseQueryOptions.md) 相同，但移除了 `suspense`
（`react-query` 会根据所调用的 Hook 推导该值，而不会将它作为选项暴露）。

## 扩展

- `OmitKeyof`\<[`UseBaseQueryOptions`](UseBaseQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryFnData`, `TQueryKey`\>, `"suspense"`\>

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

#### 继承自

```ts
OmitKeyof.subscribed
```
