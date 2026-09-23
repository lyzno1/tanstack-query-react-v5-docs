---
id: keepPreviousData
title: keepPreviousData
---


```ts
function keepPreviousData<T>(previousData: T | undefined): T | undefined;
```

定义于： [packages/query-core/src/utils.ts:499](https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L499)

用于作为查询的 `placeholderData` 选项传入，例如 `placeholderData: keepPreviousData`。在新查询键获取数据期间，它会继续显示之前获取的数据，直到新数据到达，而不会将查询数据重置为 `undefined`。

## 类型参数

### T

`T`

## 参数

### previousData

`T` | `undefined`

## 返回值

`T` \| `undefined`

## 示例

```ts
new QueryObserver(queryClient, {
  queryKey: ['posts', page],
  queryFn: () => fetchPosts(page),
  placeholderData: keepPreviousData,
})
```
