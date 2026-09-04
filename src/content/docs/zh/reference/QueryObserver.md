---
id: QueryObserver
title: QueryObserver
redirect_from:
  - framework/react/reference/QueryObserver
---

<!--
translation-source-path: reference/QueryObserver.md
translation-source-ref: main
translation-source-hash: 8f956494ea1bbdf22a60536987cc7822305d5e7604a0a472cf4ad649bb8f61c4
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

`QueryObserver` 的选项与 [`useQuery`](../framework/react/reference/functions/useQuery.md) 完全一致。
