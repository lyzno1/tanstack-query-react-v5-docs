---
id: useIsMutating
title: useIsMutating
redirect_from:
  - framework/react/reference/useIsMutating
---

```ts
function useIsMutating(filters?: MutationFilters<unknown, Error, unknown, unknown>, queryClient?: QueryClient): number;
```

定义于： [packages/react-query/src/useMutationState.ts:35](https://github.com/TanStack/query/blob/main/packages/react-query/src/useMutationState.ts#L35)

`useIsMutating` Hook 返回应用中当前处于 `pending` 状态的 mutation 数量（适合用于应用级加载指示器）。

## 参数

### filters?

[`MutationFilters`](../interfaces/MutationFilters.md)\<`unknown`, `Error`, `unknown`, `unknown`\>

用于缩小 mutation 匹配范围的 [MutationFilters](../interfaces/MutationFilters.md)。

### queryClient?

[`QueryClient`](../classes/QueryClient.md)

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

`number`

应用中当前处于 `pending` 状态的 mutation 数量。

## 示例

```tsx
import { useIsMutating } from '@tanstack/react-query'

function PostsMutatingIndicator() {
  // 有多少个与 posts 前缀匹配的 mutation 正在进行？
  const isMutatingPosts = useIsMutating({ mutationKey: ['posts'] })

  return isMutatingPosts ? <span>正在保存文章……</span> : null
}
```
