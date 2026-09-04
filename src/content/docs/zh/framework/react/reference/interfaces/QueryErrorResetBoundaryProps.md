---
id: QueryErrorResetBoundaryProps
title: QueryErrorResetBoundaryProps
---

<!--
translation-source-path: framework/react/reference/interfaces/QueryErrorResetBoundaryProps.md
translation-source-ref: main
translation-source-hash: 4b5ef15561c6042f133817f48140aa649ab9ab1df6ab4e1c067e8597bc48d727
translation-status: translated
-->


定义于：[react-query/src/QueryErrorResetBoundary.tsx:94](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryErrorResetBoundary.tsx#L94)

`QueryErrorResetBoundary` 接受的 props。

## 属性

### children

```ts
children:
  | ReactNode
  | QueryErrorResetBoundaryFunction;
```

定义于：[react-query/src/QueryErrorResetBoundary.tsx:99](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryErrorResetBoundary.tsx#L99)

可以是普通节点，也可以是一个接收边界的 `QueryErrorResetBoundaryValue` 并返回节点的函数。
