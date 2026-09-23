---
id: QueriesObserverOptions
title: QueriesObserverOptions
---


定义于： [packages/query-core/src/queriesObserver.ts:23](https://github.com/TanStack/query/blob/main/packages/query-core/src/queriesObserver.ts#L23)

## 类型参数

### TCombinedResult

`TCombinedResult` = [`QueryObserverResult`](../type-aliases/QueryObserverResult.md)[]

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="combine"></a> `combine?` | `CombineFn`\<`TCombinedResult`\> | 将 `QueryObserverResult` 数组（每个被观察的查询对应一项）合并为单个值的函数。合并结果会被记忆化；只有底层结果、查询哈希或 `combine` 函数自身发生变化时才会重新计算。默认原样返回 `QueryObserverResult` 数组。 |
