---
id: defaultShouldDehydrateQuery
title: defaultShouldDehydrateQuery
---


```ts
function defaultShouldDehydrateQuery(query: Query): boolean;
```

定义于： [packages/query-core/src/hydration.ts:186](https://github.com/TanStack/query/blob/main/packages/query-core/src/hydration.ts#L186)

`dehydrate` 使用的默认 `shouldDehydrateQuery` 谓词。只对状态为 `'success'` 的查询执行 dehydrate。

## 参数

### query

[`Query`](../classes/Query.md)

## 返回值

`boolean`
