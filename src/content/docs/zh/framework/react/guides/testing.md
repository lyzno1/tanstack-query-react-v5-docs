---
id: testing
title: 测试
---

<!--
translation-source-path: framework/react/guides/testing.md
translation-source-ref: v5.90.3
translation-source-hash: f4012179c6ed4bf087622d5dc1c9c8367ade61afae80dca9f2e3771b5fed79ec
translation-status: translated
-->


React Query 是通过 hooks 工作的，无论是我们提供的 hooks，还是在其基础上封装的自定义 hooks。

在 React 17 或更早版本中，可以借助 [React Hooks Testing Library](https://react-hooks-testing-library.com/) 为这些自定义 hooks 编写单元测试。

通过以下命令安装：

```sh
npm install @testing-library/react-hooks react-test-renderer --save-dev
```

（`react-test-renderer` 是 `@testing-library/react-hooks` 的对等依赖，版本需要与你使用的 React 版本一致。）

_注意_：在 React 18 或更高版本中，`renderHook` 已直接由 `@testing-library/react` 提供，不再需要 `@testing-library/react-hooks`。

## 第一个测试

安装完成后，就可以写一个简单测试。假设有如下自定义 hook：

```tsx
export function useCustomHook() {
  return useQuery({ queryKey: ['customHook'], queryFn: () => 'Hello' })
}
```

可以这样测试：

```tsx
import { renderHook, waitFor } from '@testing-library/react'

const queryClient = new QueryClient()
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

const { result } = renderHook(() => useCustomHook(), { wrapper })

await waitFor(() => expect(result.current.isSuccess).toBe(true))

expect(result.current.data).toEqual('Hello')
```

注意这里我们提供了一个自定义 wrapper 来创建 `QueryClient` 和 `QueryClientProvider`。这样可以确保测试与其他测试完全隔离。

你也可以只写一次这个 wrapper，但要确保每个测试前都清理 `QueryClient`，并且测试不要并行运行，否则不同测试会互相影响结果。

## 关闭重试

该库默认会进行 3 次指数退避重试，因此当你测试错误查询时很容易超时。最简单的关闭方式是在 QueryClientProvider 里配置。基于上面的例子扩展：

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ turns retries off
      retry: false,
    },
  },
})
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
```

这会把组件树内所有查询的默认行为设为“不重试”。需要注意的是，只有当实际 `useQuery` 没有显式设置重试时，这个默认值才会生效。如果某个查询明确配置了重试 5 次，它仍会优先生效，因为默认值仅作为兜底。

## 在 Jest 中将 gcTime 设为 Infinity

如果你使用 Jest，可以把 `gcTime` 设为 `Infinity`，以避免出现 “Jest did not exit one second after the test run completed” 错误信息。服务端默认就是这个行为，只有在你显式设置了 `gcTime` 时才需要调整。

## 测试网络请求

React Query 的主要用途是缓存网络请求，因此验证代码是否发出了正确请求非常重要。

测试这件事有很多方式，这里我们使用 [nock](https://www.npmjs.com/package/nock)。

假设有以下自定义 hook：

```tsx
function useFetchData() {
  return useQuery({
    queryKey: ['fetchData'],
    queryFn: () => request('/api/data'),
  })
}
```

可以这样测试：

```tsx
const queryClient = new QueryClient()
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

const expectation = nock('http://example.com').get('/api/data').reply(200, {
  answer: 42,
})

const { result } = renderHook(() => useFetchData(), { wrapper })

await waitFor(() => expect(result.current.isSuccess).toBe(true))

expect(result.current.data).toEqual({ answer: 42 })
```

这里通过 `waitFor` 等待查询状态成功，从而确定 hook 已完成并拿到了正确数据。_注意_：在 React 18 下，`waitFor` 的语义与上文所述一致有所变化。

## 测试“加载更多 / 无限滚动”

首先需要 mock API 响应：

```tsx
function generateMockedResponse(page) {
  return {
    page: page,
    items: [...]
  }
}
```

然后，`nock` 配置要根据页码返回不同响应，我们会用 `uri` 做区分。
这里 `uri` 的值类似于 `"/?page=1` 或 `/?page=2`。

```tsx
const expectation = nock('http://example.com')
  .persist()
  .query(true)
  .get('/api/data')
  .reply(200, (uri) => {
    const url = new URL(`http://example.com${uri}`)
    const { page } = Object.fromEntries(url.searchParams)
    return generateMockedResponse(page)
  })
```

（注意 `.persist()`，因为这个端点会被调用多次。）

现在可以安全执行测试，关键是等待数据断言通过：

```tsx
const { result } = renderHook(() => useInfiniteQueryCustomHook(), {
  wrapper,
})

await waitFor(() => expect(result.current.isSuccess).toBe(true))

expect(result.current.data.pages).toStrictEqual(generateMockedResponse(1))

result.current.fetchNextPage()

await waitFor(() =>
  expect(result.current.data.pages).toStrictEqual([
    ...generateMockedResponse(1),
    ...generateMockedResponse(2),
  ]),
)

expectation.done()
```

_注意_：在 React 18 下，`waitFor` 的语义与上文所述一致有所变化。

## 延伸阅读

更多技巧以及使用 `mock-service-worker` 的替代方案，可查看社区资源中的 [Testing React Query](../../community/tkdodos-blog.md#5-testing-react-query)。
