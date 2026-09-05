---
id: QueryObserver
title: QueryObserver
redirect_from:
  - framework/react/reference/QueryObserver
---

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
