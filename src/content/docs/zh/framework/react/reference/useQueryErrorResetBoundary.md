---
id: useQueryErrorResetBoundary
title: useQueryErrorResetBoundary
---

<!--
translation-source-path: framework/react/reference/useQueryErrorResetBoundary.md
translation-source-ref: v5.90.3
translation-source-hash: 489874ab6044c78f5ccd7faa6b65c409414c789947490a3451db34f91ac6cc39
translation-status: translated
-->


此 Hook 会重置最近的 `QueryErrorResetBoundary` 内的所有查询错误。如果没有定义边界，则会全局重置：

```tsx
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

const App = () => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <div>
          There was an error!
          <Button onClick={() => resetErrorBoundary()}>Try again</Button>
        </div>
      )}
    >
      <Page />
    </ErrorBoundary>
  )
}
```
