---
id: QueriesOptions
title: QueriesOptions
---

```ts
type QueriesOptions<T, TResults, TDepth> = TDepth["length"] extends MAXIMUM_DEPTH ? UseQueryOptionsForUseQueries[] : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseQueryOptionsForUseQueries<Head>] : T extends [infer Head, ...(infer Tails)] ? QueriesOptions<[...Tails], [...TResults, GetUseQueryOptionsForUseQueries<Head>], [...TDepth, 1]> : ReadonlyArray<unknown> extends T ? T : T extends UseQueryOptionsForUseQueries<infer TQueryFnData, infer TError, infer TData, infer TQueryKey>[] ? UseQueryOptionsForUseQueries<TQueryFnData, TError, TData, TQueryKey>[] : UseQueryOptionsForUseQueries[];
```

定义于： [packages/react-query/src/useQueries.ts:160](https://github.com/TanStack/query/blob/main/packages/react-query/src/useQueries.ts#L160)

`useQueries` 接受的 `queries` 数组。它会递归展开元组的每个元素，从而分别推断各项的 `queryFn`、`select` 和 `throwOnError`，最多支持 20 个元素；超过此数量的元组会回退为单一的同构选项类型。

不透明数组（如 `unknown[]`）会原样返回。元素类型在结构上符合查询选项的非元组数组，会逐项映射并分别推断类型；其他元素类型不符合预期选项形状的非元组数组，也会回退为相同的同构选项类型。

## 类型参数

### T

`T` *extends* `any`[]

调用处所写 `queries` 数组的类型。

### TResults

`TResults` *extends* `any`[] = \[\]

此类型在递归期间构建的内部累加器，不应显式设置。

### TDepth

`TDepth` *extends* `ReadonlyArray`\<`number`\> = \[\]

内部递归深度计数器，用于检查是否达到 20 个元素的限制，不应显式设置。
