---
id: infinite-query-property-order
title: Ensure correct order of inference sensitive properties for infinite queries
---

<!--
translation-source-path: eslint/infinite-query-property-order.md
translation-source-ref: v5.90.3
translation-source-hash: 3640888d103bd8997d074863efa30374ec634db80230df865708df35fddd82e6
translation-status: translated
-->


对于下列函数，由于类型推断的原因，传入对象的属性顺序很重要：

- `useInfiniteQuery`
- `useSuspenseInfiniteQuery`
- `infiniteQueryOptions`

正确的属性顺序如下：

- `queryFn`
- `getPreviousPageParam`
- `getNextPageParam`

其他属性对顺序不敏感，因为它们不依赖类型推断。

## 规则详情

此规则的**错误**代码示例：

```tsx
/* eslint "@tanstack/query/infinite-query-property-order": "warn" */
import { useInfiniteQuery } from '@tanstack/react-query'

const query = useInfiniteQuery({
  queryKey: ['projects'],
  getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
  queryFn: async ({ pageParam }) => {
    const response = await fetch(`/api/projects?cursor=${pageParam}`)
    return await response.json()
  },
  initialPageParam: 0,
  getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
  maxPages: 3,
})
```

此规则的**正确**代码示例：

```tsx
/* eslint "@tanstack/query/infinite-query-property-order": "warn" */
import { useInfiniteQuery } from '@tanstack/react-query'

const query = useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: async ({ pageParam }) => {
    const response = await fetch(`/api/projects?cursor=${pageParam}`)
    return await response.json()
  },
  initialPageParam: 0,
  getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
  getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
  maxPages: 3,
})
```

## 属性

- [x] ✅ Recommended
- [x] 🔧 Fixable
