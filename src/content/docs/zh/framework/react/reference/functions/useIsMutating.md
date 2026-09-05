---
id: useIsMutating
title: useIsMutating
redirect_from:
  - framework/react/reference/useIsMutating
---

```ts
function useIsMutating(filters?, queryClient?): number;
```

定义于： [react-query/src/useMutationState.ts:35](https://github.com/TanStack/query/blob/main/packages/react-query/src/useMutationState.ts#L35)

`useIsMutating` Hook 返回应用中当前处于 `pending` 状态的变更数量（适合用于应用级加载指示器）。

## 参数

### filters?

`MutationFilters`\<`unknown`, `Error`, `unknown`, `unknown`\>

用于缩小变更匹配范围的 `MutationFilters`。

### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

`number`

应用中当前处于 `pending` 状态的变更数量。

## 示例

```tsx
import { useIsMutating } from '@tanstack/react-query'

function PostsMutatingIndicator() {
  // 有多少个与 posts 前缀匹配的变更正在进行？
  const isMutatingPosts = useIsMutating({ mutationKey: ['posts'] })

  return isMutatingPosts ? <span>正在保存文章……</span> : null
}
```
