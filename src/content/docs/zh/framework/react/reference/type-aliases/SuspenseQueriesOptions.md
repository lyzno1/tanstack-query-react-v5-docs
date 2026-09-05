---
id: SuspenseQueriesOptions
title: SuspenseQueriesOptions
---

```ts
type SuspenseQueriesOptions<T, TResults, TDepth> = TDepth["length"] extends MAXIMUM_DEPTH ? UseSuspenseQueryOptions[] : T extends [] ? [] : T extends [infer Head] ? [...TResults, GetUseSuspenseQueryOptions<Head>] : T extends [infer Head, ...(infer Tails)] ? SuspenseQueriesOptions<[...Tails], [...TResults, GetUseSuspenseQueryOptions<Head>], [...TDepth, 1]> : unknown[] extends T ? T : T extends UseSuspenseQueryOptions<infer TQueryFnData, infer TError, infer TData, infer TQueryKey>[] ? UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>[] : UseSuspenseQueryOptions[];
```

定义于：[react-query/src/useSuspenseQueries.ts:119](https://github.com/TanStack/query/blob/main/packages/react-query/src/useSuspenseQueries.ts#L119)

`useSuspenseQueries` 接受的 `queries` 数组。它会递归展开元组中的每个元素，使每一项的
`queryFn`/`select` 都能被单独推断，最多支持 20 个元素。不透明数组（例如 `unknown[]`）会
原样返回；元素类型已知的非元组数组，或超过 20 个元素的元组，则会回退为单一且统一的
[UseSuspenseQueryOptions](../interfaces/UseSuspenseQueryOptions.md) 类型。

## 类型参数

### T

`T` *extends* `any`[]

调用处所传入的 `queries` 数组类型。

### TResults

`TResults` *extends* `any`[] = \[\]

此类型在递归过程中构建的内部累加器，不应显式设置。

### TDepth

`TDepth` *extends* `ReadonlyArray`\<`number`\> = \[\]

内部递归深度计数器，用于检查是否达到 20 个元素的限制，不应显式设置。
