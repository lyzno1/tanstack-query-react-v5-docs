---
id: no-unstable-deps
title: 禁止将查询 Hook 的结果直接放入 React Hook 的依赖数组
---

<!--
translation-source-path: eslint/no-unstable-deps.md
translation-source-ref: main
translation-source-hash: ecf3d1eb030a1a5510445fb7a92d42ee145964af4139e6409abed2362e2a820f
translation-status: translated
-->


以下查询 Hook 返回的对象在引用上**并不稳定**：

- `useQuery`
- `useSuspenseQuery`
- `useQueries`
- `useSuspenseQueries`
- `useInfiniteQuery`
- `useSuspenseInfiniteQuery`
- `useMutation`

这些 Hook 返回的对象**不应**直接放入 React Hook（如 `useEffect`、`useMemo`、`useCallback`）的依赖数组中。
应改为先解构查询 Hook 的返回值，再将解构出的值传入 React Hook 的依赖数组。

## 规则详情

此规则的**错误**代码示例：

```tsx
/* eslint "@tanstack/query/no-unstable-deps": "warn" */
import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

function Component() {
  const mutation = useMutation({ mutationFn: (value: string) => value })
  const callback = useCallback(() => {
    mutation.mutate('hello')
  }, [mutation])
  return null
}
```

此规则的**正确**代码示例：

```tsx
/* eslint "@tanstack/query/no-unstable-deps": "warn" */
import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

function Component() {
  const { mutate } = useMutation({ mutationFn: (value: string) => value })
  const callback = useCallback(() => {
    mutate('hello')
  }, [mutate])
  return null
}
```

## 属性

- [x] ✅ Recommended
- [ ] 🔧 Fixable
