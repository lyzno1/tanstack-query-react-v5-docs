---
id: InfiniteQueryObserver
title: InfiniteQueryObserver
redirect_from:
  - framework/react/reference/InfiniteQueryObserver
---

<!--
translation-source-path: reference/InfiniteQueryObserver.md
translation-source-ref: main
translation-source-hash: 6816a206df11504275fe4540c66da24cc3f9bbb5090414ebcd3c98f3d344a39c
translation-status: translated
-->


`InfiniteQueryObserver` 可用于观察无限查询并在它们之间切换。

```tsx
const observer = new InfiniteQueryObserver(queryClient, {
  queryKey: ['posts'],
  queryFn: fetchPosts,
  getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
})

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
  unsubscribe()
})
```

**选项**

`InfiniteQueryObserver` 的选项与 [`useInfiniteQuery`](../framework/react/reference/functions/useInfiniteQuery.md) 完全一致。
