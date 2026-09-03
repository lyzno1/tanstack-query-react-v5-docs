---
id: QueryErrorResetBoundaryFunction
title: QueryErrorResetBoundaryFunction
---

<!--
translation-source-path: framework/react/reference/type-aliases/QueryErrorResetBoundaryFunction.md
translation-source-ref: main
translation-source-hash: 70475f31079cbebbcbe3c407a0aa32771cf1a6c842b9dc98ecab817dce9155f4
translation-status: translated
-->


```ts
type QueryErrorResetBoundaryFunction = (value) => React.ReactNode;
```

定义于：[react-query/src/QueryErrorResetBoundary.tsx:87](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryErrorResetBoundary.tsx#L87)

可作为 `QueryErrorResetBoundary` 的 `children` 使用的 render prop 函数。

## 参数

### value

`QueryErrorResetBoundaryValue`

该边界的 `QueryErrorResetBoundaryValue`。

## 返回值

`React.ReactNode`

要渲染的 children。
