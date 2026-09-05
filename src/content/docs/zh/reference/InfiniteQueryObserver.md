---
id: InfiniteQueryObserver
title: InfiniteQueryObserver
redirect_from:
  - framework/react/reference/InfiniteQueryObserver
---

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
