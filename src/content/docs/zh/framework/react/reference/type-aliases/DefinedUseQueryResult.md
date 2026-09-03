---
id: DefinedUseQueryResult
title: DefinedUseQueryResult
---

<!--
translation-source-path: framework/react/reference/type-aliases/DefinedUseQueryResult.md
translation-source-ref: main
translation-source-hash: 2975a68555ec7ea6a768ddf4c531534f522f6b89b9ad43f510a1753e9c658209
translation-status: translated
-->


```ts
type DefinedUseQueryResult<TData, TError> = DefinedQueryObserverResult<TData, TError>;
```

定义于：[react-query/src/types.ts:353](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L353)

设置 `initialData` 时 `useQuery` 的结果，或省略 `isPlaceholderData` 之前 `useSuspenseQuery` 的结果——
此时 `data` 永远不会是 `undefined`。它重新导出了 `@tanstack/query-core` 中的
`DefinedQueryObserverResult`。

## 类型参数

### TData

`TData` = `unknown`

`select` 执行后最终得到的 `data` 类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。
