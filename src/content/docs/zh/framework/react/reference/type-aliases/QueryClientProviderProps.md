---
id: QueryClientProviderProps
title: QueryClientProviderProps
---

```ts
type QueryClientProviderProps = object;
```

定义于：[react-query/src/QueryClientProvider.tsx:38](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryClientProvider.tsx#L38)

`QueryClientProvider` 接受的 props。

## 属性

### children?

```ts
optional children: React.ReactNode;
```

定义于：[react-query/src/QueryClientProvider.tsx:48](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryClientProvider.tsx#L48)

能够访问所提供 `QueryClient` 的组件。

***

### client

```ts
client: QueryClient;
```

定义于：[react-query/src/QueryClientProvider.tsx:44](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryClientProvider.tsx#L44)

**必填**

要提供的 `QueryClient` 实例。
