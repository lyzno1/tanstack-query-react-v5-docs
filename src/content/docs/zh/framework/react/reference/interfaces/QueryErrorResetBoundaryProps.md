---
id: QueryErrorResetBoundaryProps
title: QueryErrorResetBoundaryProps
---

定义于： [packages/react-query/src/QueryErrorResetBoundary.tsx:94](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryErrorResetBoundary.tsx#L94)

`QueryErrorResetBoundary` 接受的 props。

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="children"></a> `children` | \| `ReactNode` \| [`QueryErrorResetBoundaryFunction`](../type-aliases/QueryErrorResetBoundaryFunction.md) | 要渲染的组件：始终无条件渲染，不等待 hydration。新查询在渲染期间 hydrate 到缓存；缓存中已有的查询仅在 dehydrate 数据更新时才会 hydrate，而且发生在提交后的 Effect 中，因此 `children` 可能短暂显示旧数据。 |
