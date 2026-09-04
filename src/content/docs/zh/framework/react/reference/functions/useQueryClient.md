---
id: useQueryClient
title: useQueryClient
redirect_from:
  - framework/react/reference/useQueryClient
---

<!--
translation-source-path: framework/react/reference/functions/useQueryClient.md
translation-source-ref: main
translation-source-hash: 215237d9398bfdb19491f66fff8cd285524a4680e5cbc550ee4825705a99ce1c
translation-status: translated
-->


```ts
function useQueryClient(queryClient?): QueryClient;
```

定义于： [react-query/src/QueryClientProvider.tsx:21](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryClientProvider.tsx#L21)

`useQueryClient` Hook 返回当前的 `QueryClient` 实例。

## 参数

### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

`QueryClient`

当前的 `QueryClient` 实例。

## 抛出

如果既未传入 `queryClient` 参数，也未在组件树中找到 `QueryClientProvider`，则会抛出错误。
