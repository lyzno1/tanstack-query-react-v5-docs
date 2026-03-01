---
id: default-query-function
title: 默认查询函数
---

<!--
translation-source-path: framework/react/guides/default-query-function.md
translation-source-ref: v5.90.3
translation-source-hash: da695c29a919b2237501d92eeb57f44534c2d0ab70e55618a1c61956ffdc9d73
translation-status: translated
-->


如果你出于某些原因希望在整个应用中共用同一个查询函数，仅通过查询键来标识要获取什么数据，那么你可以通过给 TanStack Query 提供一个**默认查询函数**来实现：

[//]: # 'Example'

```tsx
// Define a default query function that will receive the query key
const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com${queryKey[0]}`,
  )
  return data
}

// provide the default query function to your app with defaultOptions
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  )
}

// All you have to do now is pass a key!
function Posts() {
  const { status, data, error, isFetching } = useQuery({ queryKey: ['/posts'] })

  // ...
}

// You can even leave out the queryFn and just go straight into options
function Post({ postId }) {
  const { status, data, error, isFetching } = useQuery({
    queryKey: [`/posts/${postId}`],
    enabled: !!postId,
  })

  // ...
}
```

[//]: # 'Example'

如果你想覆盖默认 `queryFn`，像平常一样单独传入你自己的函数即可。
