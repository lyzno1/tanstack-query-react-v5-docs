---
id: HydrationBoundary
title: HydrationBoundary
---

```ts
function HydrationBoundary(__namedParameters): ReactElement<unknown, string | JSXElementConstructor<any>>;
```

定义于： [react-query/src/HydrationBoundary.tsx:86](https://github.com/TanStack/query/blob/main/packages/react-query/src/HydrationBoundary.tsx#L86)

`HydrationBoundary` 会把先前脱水得到的状态添加到 `useQueryClient()` 所返回的 `queryClient` 中。
如果客户端中已经存在数据，则会根据更新时间戳智能合并新的查询。

注意：`HydrationBoundary` 只支持 `queries` 的脱水状态。

## 参数

### \_\_namedParameters

[`HydrationBoundaryProps`](../interfaces/HydrationBoundaryProps.md)

## 返回值

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

无条件渲染传入的 `children`。对于 `state` 中的新查询，会在渲染期间将其水合到缓存中；
对于缓存中已经存在的查询，则会在提交后的 Effect 中，仅水合较新的脱水数据。

## 示例

```tsx
import { HydrationBoundary } from '@tanstack/react-query'

function App() {
  return <HydrationBoundary state={dehydratedState}>...</HydrationBoundary>
}
```

通过 `dehydrate` 将服务端预取的结果交给客户端：
```tsx
import { HydrationBoundary, dehydrate, noop } from '@tanstack/react-query'

async function ServerComponent() {
  const queryClient = getQueryClient()

  await queryClient
    .query({
      queryKey: ['posts'],
      queryFn: fetchPosts,
    })
    .catch(noop)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```
