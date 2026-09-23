---
id: DehydratedState
title: DehydratedState
---


定义于： [packages/query-core/src/hydration.ts:95](https://github.com/TanStack/query/blob/main/packages/query-core/src/hydration.ts#L95)

`QueryClient` 缓存的可序列化快照，由 `dehydrate` 生成，供 `hydrate` 使用。通常从服务端传到客户端（例如嵌入服务端渲染的标记中），用已获取的数据填充客户端缓存，避免客户端重复获取。

## 属性

| 属性 | 类型 |
| ------ | ------ |
| <a id="mutations"></a> `mutations` | `DehydratedMutation`[] |
| <a id="queries"></a> `queries` | `DehydratedQuery`[] |
