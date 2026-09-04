---
id: QueryClientContext
title: QueryClientContext
---

<!--
translation-source-path: framework/react/reference/variables/QueryClientContext.md
translation-source-ref: main
translation-source-hash: 95c0e8b0bfddfeaff598af8a745d3efc1d05c129308d8b624ef5ddf1b3bec025
translation-status: translated
-->


```ts
const QueryClientContext: Context<QueryClient | undefined>;
```

定义于：[react-query/src/QueryClientProvider.tsx:9](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryClientProvider.tsx#L9)

`useQueryClient` 从此 context 中读取 Query Client。通常应通过 `QueryClientProvider` 来设置它。
