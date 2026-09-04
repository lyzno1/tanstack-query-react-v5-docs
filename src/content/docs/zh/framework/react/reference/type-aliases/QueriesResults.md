---
id: QueriesResults
title: QueriesResults
---

<!--
translation-source-path: framework/react/reference/type-aliases/QueriesResults.md
translation-source-ref: main
translation-source-hash: 12e89ff3dbd5fe57700704df224b2124853b7c0f8a1e91f8be87e5993998290e
translation-status: translated
-->


```ts
type QueriesResults<T, TResults, TDepth> = TDepth["length"] extends MAXIMUM_DEPTH ? UseQueryResult[] : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseQueryResult<Head>] : T extends [infer Head, ...(infer Tails)] ? QueriesResults<[...Tails], [...TResults, GetUseQueryResult<Head>], [...TDepth, 1]> : { [K in keyof T]: GetUseQueryResult<T[K]> };
```

定义于：[react-query/src/useQueries.ts:207](https://github.com/TanStack/query/blob/main/packages/react-query/src/useQueries.ts#L207)

未提供 `combine` 时，`useQueries` 返回的结果类型。它与 [QueriesOptions](QueriesOptions.md) 相对应：
分别推断每个元组元素的结果类型，最多支持 20 个元素。对于非元组数组，则会逐元素映射，仍然分别推断
每一项；只有超过 20 个元素时，才会回退为单一且统一的 [UseQueryResult](UseQueryResult.md) 类型。

## 类型参数

### T

`T` *extends* `any`[]

由 [QueriesOptions](QueriesOptions.md) 推断出的 `queries` 数组类型。

### TResults

`TResults` *extends* `any`[] = \[\]

此类型在递归期间构建的内部累加器，不应显式设置。

### TDepth

`TDepth` *extends* `ReadonlyArray`\<`number`\> = \[\]

内部递归深度计数器，用于检查是否达到 20 个元素的限制，不应显式设置。
