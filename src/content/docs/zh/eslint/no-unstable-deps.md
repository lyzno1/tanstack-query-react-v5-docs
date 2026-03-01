---
id: no-unstable-deps
title: Disallow putting the result of query hooks directly in a React hook dependency array
---

<!--
translation-source-path: eslint/no-unstable-deps.md
translation-source-ref: v5.90.3
translation-source-hash: 02f9a9a886bd4770969091541f01d6b1d099ba962e31d89b3f309f395473f7ea
translation-status: translated
-->


以下查询 hooks 返回的对象在引用上**并不稳定**：

- `useQuery`
- `useSuspenseQuery`
- `useQueries`
- `useSuspenseQueries`
- `useInfiniteQuery`
- `useSuspenseInfiniteQuery`
- `useMutation`

这些 hooks 返回的对象**不应**直接放入 React hook（如 `useEffect`、`useMemo`、`useCallback`）的依赖数组中。
应改为先解构查询 hook 的返回值，再把解构出的值放进 React hook 的依赖数组。

## 规则详情

此规则的**错误**代码示例：

```tsx
/* eslint "@tanstack/query/no-unstable-deps": "warn" */
import { useCallback } from 'React'
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
import { useCallback } from 'React'
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
