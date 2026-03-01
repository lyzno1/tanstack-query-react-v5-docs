---
id: InfiniteQueryObserver
title: InfiniteQueryObserver
---

<!--
translation-source-path: reference/InfiniteQueryObserver.md
translation-source-ref: v5.90.3
translation-source-hash: aca49fb9044d16991ad99bd92c6bfe1b7f9f909718184327936031b3958d848a
translation-status: translated
-->


## `InfiniteQueryObserver`

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

`InfiniteQueryObserver` 的选项与 [`useInfiniteQuery`](../../framework/react/reference/useInfiniteQuery) 完全一致。
