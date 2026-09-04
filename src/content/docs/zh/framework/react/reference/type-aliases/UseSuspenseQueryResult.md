---
id: UseSuspenseQueryResult
title: UseSuspenseQueryResult
---

<!--
translation-source-path: framework/react/reference/type-aliases/UseSuspenseQueryResult.md
translation-source-ref: main
translation-source-hash: eb49c6e1362d24d424a08bc84edea91f1caab2cd7b657b0be8b59f838facf6c2
translation-status: translated
-->


```ts
type UseSuspenseQueryResult<TData, TError> = DistributiveOmit<DefinedQueryObserverResult<TData, TError>, "isPlaceholderData">;
```

定义于：[react-query/src/types.ts:337](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L337)

`useSuspenseQuery` 的结果。它与 [DefinedUseQueryResult](DefinedUseQueryResult.md) 相同，但移除了
`isPlaceholderData`——该字段在原类型中始终为 `false`，因此这里移除的是一个不再承载有效信息的字段，
而不是一种实际存在的状态。

## 类型参数

### TData

`TData` = `unknown`

`select` 执行后 `data` 的最终类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。
