---
id: useQueryErrorResetBoundary
title: useQueryErrorResetBoundary
redirect_from:
  - framework/react/reference/useQueryErrorResetBoundary
---

```ts
function useQueryErrorResetBoundary(): QueryErrorResetBoundaryValue;
```

定义于： [react-query/src/QueryErrorResetBoundary.tsx:76](https://github.com/TanStack/query/blob/main/packages/react-query/src/QueryErrorResetBoundary.tsx#L76)

此 Hook 会重置最近的 `QueryErrorResetBoundary` 内的所有查询错误。如果没有定义边界，则会在全局范围内重置。

## 返回值

`QueryErrorResetBoundaryValue`

该边界的 `QueryErrorResetBoundaryValue`。

## 示例

```tsx
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'

function App({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <div>
          出错了！
          <button onClick={() => resetErrorBoundary()}>重试</button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
```
