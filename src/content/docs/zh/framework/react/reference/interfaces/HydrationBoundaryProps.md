---
id: HydrationBoundaryProps
title: HydrationBoundaryProps
---

定义于： [packages/react-query/src/HydrationBoundary.tsx:16](https://github.com/TanStack/query/blob/main/packages/react-query/src/HydrationBoundary.tsx#L16)

`HydrationBoundary` 接受的 props。

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="children"></a> `children?` | `ReactNode` | 要渲染的组件：始终无条件渲染，不等待 hydration。新查询在渲染期间 hydrate 到缓存；缓存中已有的查询仅在 dehydrate 数据更新时才会 hydrate，而且发生在提交后的 Effect 中，因此 `children` 可能短暂显示旧数据。 |
| <a id="options"></a> `options?` | [`OmitKeyof`](../type-aliases/OmitKeyof.md)\<[`HydrateOptions`](HydrateOptions.md), `"defaultOptions"`\> & `object` | 可选。注意：与 `hydrate` 不同，这里不能设置 `mutations`。 |
| <a id="queryclient"></a> `queryClient?` | [`QueryClient`](../classes/QueryClient.md) | 使用自定义 `QueryClient`；否则使用最近的 context 提供的实例。 |
| <a id="state"></a> `state` | [`DehydratedState`](DehydratedState.md) \| `null` \| `undefined` | 要 hydrate 的状态。 |
