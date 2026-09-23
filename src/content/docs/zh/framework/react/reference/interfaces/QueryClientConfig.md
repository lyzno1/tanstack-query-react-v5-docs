---
id: QueryClientConfig
title: QueryClientConfig
---


定义于： [packages/query-core/src/types.ts:1615](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1615)

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="defaultoptions"></a> `defaultOptions?` | [`DefaultOptions`](DefaultOptions.md)\<`Error`\> | 通过此客户端创建的所有查询和 mutation 的默认选项。 |
| <a id="mutationcache"></a> `mutationCache?` | [`MutationCache`](../classes/MutationCache.md) | 此客户端连接的 mutation 缓存；未提供时会创建新的 `MutationCache`。 |
| <a id="querycache"></a> `queryCache?` | [`QueryCache`](../classes/QueryCache.md) | 此客户端连接的查询缓存；未提供时会创建新的 `QueryCache`。 |
