---
id: SuspenseQueriesResults
title: SuspenseQueriesResults
---

<!--
translation-source-path: framework/react/reference/type-aliases/SuspenseQueriesResults.md
translation-source-ref: main
translation-source-hash: c5c8564a927cc05cb27dcc50247064ed45de9fa2be99e7a7c6f927cdb33cbe8c
translation-status: translated
-->


```ts
type SuspenseQueriesResults<T, TResults, TDepth> = TDepth["length"] extends MAXIMUM_DEPTH ? UseSuspenseQueryResult[] : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseSuspenseQueryResult<Head>] : T extends [infer Head, ...(infer Tails)] ? SuspenseQueriesResults<[...Tails], [...TResults, GetUseSuspenseQueryResult<Head>], [...TDepth, 1]> : { [K in keyof T]: GetUseSuspenseQueryResult<T[K]> };
```

定义于：[react-query/src/useSuspenseQueries.ts:165](https://github.com/TanStack/query/blob/main/packages/react-query/src/useSuspenseQueries.ts#L165)

未提供 `combine` 时，`useSuspenseQueries` 返回的结果类型。它与
[SuspenseQueriesOptions](SuspenseQueriesOptions.md) 相对应：元组中每个元素的结果类型都会被单独推断，
最多支持 20 个元素。对于非元组数组，它会逐个映射元素，仍然分别推断每一项；只有超过 20 个元素时，
才会回退为单一且统一的 [UseSuspenseQueryResult](UseSuspenseQueryResult.md) 类型。

## 类型参数

### T

`T` *extends* `any`[]

由 [SuspenseQueriesOptions](SuspenseQueriesOptions.md) 推断出的 `queries` 数组类型。

### TResults

`TResults` *extends* `any`[] = \[\]

此类型在递归过程中构建的内部累加器，不应显式设置。

### TDepth

`TDepth` *extends* `ReadonlyArray`\<`number`\> = \[\]

内部递归深度计数器，用于检查是否达到 20 个元素的限制，不应显式设置。
