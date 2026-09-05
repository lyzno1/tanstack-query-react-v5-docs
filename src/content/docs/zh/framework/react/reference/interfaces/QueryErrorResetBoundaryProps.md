---
id: QueryErrorResetBoundaryProps
title: QueryErrorResetBoundaryProps
---

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
