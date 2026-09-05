---
id: useIsFetching
title: useIsFetching
redirect_from:
  - framework/react/reference/useIsFetching
---

```ts
function useIsFetching(filters?, queryClient?): number;
```

定义于： [react-query/src/useIsFetching.ts:44](https://github.com/TanStack/query/blob/main/packages/react-query/src/useIsFetching.ts#L44)

`useIsFetching` Hook 返回应用中正在加载或后台获取的查询数量（适合用于应用级加载指示器）。

## 参数

### filters?

`QueryFilters`\<readonly `unknown`[]\>

用于缩小查询匹配范围的 `QueryFilters`。

### queryClient?

`QueryClient`

使用此参数可指定自定义 `QueryClient`。否则，将使用最近的上下文所提供的实例。

## 返回值

`number`

应用当前正在加载或后台获取的查询数量。

## 示例

```tsx
import { useIsFetching } from '@tanstack/react-query'

function PostsFetchingIndicator() {
  // 有多少个与 posts 前缀匹配的查询正在获取？
  const isFetchingPosts = useIsFetching({ queryKey: ['posts'] })

  return isFetchingPosts ? <span>正在刷新文章……</span> : null
}
```

为所有正在后台获取的查询显示全局加载指示器，而不仅限于屏幕中的查询：
```tsx
import { useIsFetching } from '@tanstack/react-query'

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching()

  return isFetching ? (
    <div>查询正在后台获取……</div>
  ) : null
}
```
