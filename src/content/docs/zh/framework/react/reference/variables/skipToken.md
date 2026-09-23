---
id: skipToken
title: skipToken
---


```ts
const skipToken: typeof skipToken;
```

定义于： [packages/query-core/src/utils.ts:528](https://github.com/TanStack/query/blob/main/packages/query-core/src/utils.ts#L528)

可作为查询的 `queryFn` 传入的哨兵值，用于按条件禁用查询（相当于 `enabled: false`），同时保留查询数据的完整类型推断。与 `enabled: false` 不同，使用 `skipToken` 禁用的查询无法通过 `refetch` 触发。

## 示例

```ts
new QueryObserver(queryClient, {
  queryKey: ['post', postId],
  queryFn: postId != null ? () => fetchPost(postId) : skipToken,
})
```
