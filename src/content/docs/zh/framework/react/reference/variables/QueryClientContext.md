---
id: QueryClientContext
title: QueryClientContext
---

```ts
const QueryClientContext: Context<QueryClient | undefined>;
```

定义于：[react-query/src/QueryClientProvider.tsx:9](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryClientProvider.tsx#L9)

`useQueryClient` 从此 context 中读取 Query Client。通常应通过 `QueryClientProvider` 来设置它。
