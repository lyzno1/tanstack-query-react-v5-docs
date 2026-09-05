---
id: QueryErrorResetBoundary
title: QueryErrorResetBoundary
redirect_from:
  - framework/react/reference/QueryErrorResetBoundary
---

```ts
function QueryErrorResetBoundary(__namedParameters): Element;
```

定义于： [react-query/src/QueryErrorResetBoundary.tsx:136](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryErrorResetBoundary.tsx#L136)

在查询中使用 `suspense` 或 `throwOnError` 时，需要有一种方式告知查询：发生错误后重新渲染时，
希望再次尝试。使用 `QueryErrorResetBoundary` 组件，可以重置该组件边界内的所有查询错误。

## 参数

### \_\_namedParameters

[`QueryErrorResetBoundaryProps`](../interfaces/QueryErrorResetBoundaryProps.md)

## 返回值

`Element`

如果 `children` 不是函数，则原样渲染；如果是函数，则以该边界的 `QueryErrorResetBoundaryValue`
作为参数调用它。

## 示例

```tsx
import { ErrorBoundary } from 'react-error-boundary'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              出错了！
              <button onClick={() => resetErrorBoundary()}>重试</button>
            </div>
          )}
        >
          <Page />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```
