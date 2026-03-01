---
id: QueriesObserver
title: QueriesObserver
---

<!--
translation-source-path: reference/QueriesObserver.md
translation-source-ref: v5.90.3
translation-source-hash: 538febbb2e7c3a99827da9294f93ef50b75ee2303685bfd0cf0343ec34adefa6
translation-status: translated
-->


## `QueriesObserver`

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

`QueriesObserver` 的选项与 [`useQueries`](../../framework/react/reference/useQueries) 完全一致。
