---
id: HydrationBoundaryProps
title: HydrationBoundaryProps
---

定义于：[react-query/src/HydrationBoundary.tsx:16](https://github.com/TanStack/query/blob/main/packages/react-query/src/HydrationBoundary.tsx#L16)

`HydrationBoundary` 接受的 props。

## 属性

### children?

```ts
optional children: ReactNode;
```

定义于：[react-query/src/HydrationBoundary.tsx:36](https://github.com/TanStack/query/blob/main/packages/react-query/src/HydrationBoundary.tsx#L36)

要渲染的组件——始终无条件渲染，不受水合过程限制。新查询会在渲染期间水合到缓存中；对于缓存中
已经存在的查询，只有较新的脱水数据会被水合，并且该过程发生在提交后的 Effect 中，因此在这些数据
写入缓存之前，`children` 可能会短暂渲染。

***

### options?

```ts
optional options: OmitKeyof<HydrateOptions, "defaultOptions"> & object;
```

定义于：[react-query/src/HydrationBoundary.tsx:24](https://github.com/TanStack/query/blob/main/packages/react-query/src/HydrationBoundary.tsx#L24)

可选。请注意：与 `hydrate` 不同，此处不能设置 `mutations`。

#### 类型声明

##### defaultOptions?

```ts
optional defaultOptions: OmitKeyof<{
}, "mutations">;
```

***

### queryClient?

```ts
optional queryClient: QueryClient;
```

定义于：[react-query/src/HydrationBoundary.tsx:40](https://github.com/TanStack/query/blob/main/packages/react-query/src/HydrationBoundary.tsx#L40)

使用此属性可指定自定义 `QueryClient`。否则将使用最近一层上下文中的 `QueryClient`。

***

### state

```ts
state: DehydratedState | null | undefined;
```

定义于：[react-query/src/HydrationBoundary.tsx:20](https://github.com/TanStack/query/blob/main/packages/react-query/src/HydrationBoundary.tsx#L20)

要进行水合的状态。
