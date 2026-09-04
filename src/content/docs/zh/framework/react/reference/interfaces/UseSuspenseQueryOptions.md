---
id: UseSuspenseQueryOptions
title: UseSuspenseQueryOptions
---

<!--
translation-source-path: framework/react/reference/interfaces/UseSuspenseQueryOptions.md
translation-source-ref: main
translation-source-hash: 7178c5b5a9903a4dd621d61978d39a2093df316199f2f3314cd510e9460a6cff
translation-status: translated
-->


定义于：[react-query/src/types.ts:196](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L196)

`useSuspenseQuery` 接受的选项。它与 [UseQueryOptions](UseQueryOptions.md) 相同，但移除了 `enabled`、
`throwOnError` 和 `placeholderData`。Suspense Hook 无法渲染“已禁用”或“占位”状态，因此这些选项并不适用。

## 扩展

- `OmitKeyof`\<[`UseQueryOptions`](UseQueryOptions.md)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>, `"queryFn"` \| `"enabled"` \| `"throwOnError"` \| `"placeholderData"`\>

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

### queryFn?

```ts
optional queryFn: QueryFunction<TQueryFnData, TQueryKey, never>;
```

定义于：[react-query/src/types.ts:209](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L209)

此处不允许使用 `skipToken`——Suspense Hook 无法渲染“已禁用”状态，因此必须始终提供查询函数，
除非已经定义了默认查询函数。

***

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
