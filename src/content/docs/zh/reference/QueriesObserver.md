---
id: QueriesObserver
title: QueriesObserver
redirect_from:
  - framework/react/reference/QueriesObserver
---

<!--
translation-source-path: reference/QueriesObserver.md
translation-source-ref: main
translation-source-hash: de3126b53d842e75cc838221af0c3fb431299e9fca5fe0aa615680b298a08bb1
translation-status: translated
-->


`QueriesObserver` 可用于观察多个查询。

```tsx
const observer = new QueriesObserver(queryClient, [
  { queryKey: ['post', 1], queryFn: fetchPost },
  { queryKey: ['post', 2], queryFn: fetchPost },
])

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
  unsubscribe()
})
```

**选项**

`QueriesObserver` 的选项与 [`useQueries`](../framework/react/reference/functions/useQueries.md) 完全一致。
