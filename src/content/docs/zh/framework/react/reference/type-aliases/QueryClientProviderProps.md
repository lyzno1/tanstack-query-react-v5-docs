---
id: QueryClientProviderProps
title: QueryClientProviderProps
---

```ts
type QueryClientProviderProps = object;
```

定义于： [packages/react-query/src/QueryClientProvider.tsx:38](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryClientProvider.tsx#L38)

`QueryClientProvider` 接受的 props。

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="children"></a> `children?` | `React.ReactNode` | 获得所提供 `QueryClient` 的组件。 |
| <a id="client"></a> `client` | [`QueryClient`](../classes/QueryClient.md) | **必填** 要提供的 `QueryClient` 实例。 |
