---
id: QueryObserver
title: QueryObserver
---

<!--
translation-source-path: reference/QueryObserver.md
translation-source-ref: v5.90.3
translation-source-hash: 36deff470afec7c6884cd7691b0221fa36e56552726616704483b1ae0ef97d8d
translation-status: translated
-->


`QueryObserver` 可用于观察查询并在不同查询之间切换。

```tsx
const observer = new QueryObserver(queryClient, { queryKey: ['posts'] })

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
  unsubscribe()
})
```

**选项**

`QueryObserver` 的选项与 [`useQuery`](../../framework/react/reference/useQuery) 完全一致。
