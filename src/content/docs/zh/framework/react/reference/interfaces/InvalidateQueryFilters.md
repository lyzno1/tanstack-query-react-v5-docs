---
id: InvalidateQueryFilters
title: InvalidateQueryFilters
---


定义于： [packages/query-core/src/types.ts:774](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L774)

用于筛选查询的条件，例如传给 `queryClient.getQueriesData` 或 `queryClient.invalidateQueries`。所有提供的条件都必须匹配；未指定的条件会被忽略。

## 继承

- [`QueryFilters`](QueryFilters.md)\<`TQueryKey`\>

## 类型参数

### TQueryKey

`TQueryKey` *extends* [`QueryKey`](../type-aliases/QueryKey.md) = [`QueryKey`](../type-aliases/QueryKey.md)

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| ------ | ------ | ------ | ------ |
| <a id="exact"></a> `exact?` | `boolean` | `undefined` | 精确匹配查询键 |
| <a id="fetchstatus"></a> `fetchStatus?` | `"fetching"` \| `"paused"` \| `"idle"` | `undefined` | 包含获取状态匹配的查询 |
| <a id="predicate"></a> `predicate?` | (`query`: [`Query`](../classes/Query.md)) => `boolean` | `undefined` | 包含符合此谓词函数的查询 |
| <a id="querykey"></a> `queryKey?` | `TQueryKey` \| `TuplePrefixes`\<`TQueryKey`\> | `undefined` | 包含匹配此查询键的查询 |
| <a id="refetchtype"></a> `refetchType?` | `QueryTypeFilter` \| `"none"` | `'active'` | 控制哪些已匹配（现已失效）的查询在后台重新获取：`'active'` 只获取至少有一个活跃观察者的查询；`'inactive'` 只获取没有活跃观察者的查询；`'all'` 获取全部匹配的查询；`'none'` 不重新获取，只将匹配的查询标记为失效。 |
| <a id="stale"></a> `stale?` | `boolean` | `undefined` | 包含或排除 stale 查询 |
| <a id="type"></a> `type?` | `QueryTypeFilter` | `'all'` | 只筛选活跃查询、非活跃查询或全部查询 |
