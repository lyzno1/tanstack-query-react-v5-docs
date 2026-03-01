---
id: QueryErrorResetBoundary
title: QueryErrorResetBoundary
---

<!--
translation-source-path: framework/react/reference/QueryErrorResetBoundary.md
translation-source-ref: v5.90.3
translation-source-hash: 3ecc98d707a57fd2609794fc6169b00023649268789632a1f902be6d297f4211
translation-status: translated
-->


当你在查询中使用 **suspense** 或 **throwOnError** 时，需要一种方式让查询知道：在某次错误发生后重新渲染时，你希望再次尝试。使用 `QueryErrorResetBoundary` 组件，你可以在其边界内重置任意查询错误。

```tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

const App = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
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
    )}
  </QueryErrorResetBoundary>
)
```
