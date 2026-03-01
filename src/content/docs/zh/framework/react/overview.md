---
id: overview
title: Overview
---

<!--
translation-source-path: framework/react/overview.md
translation-source-ref: v5.90.3
translation-source-hash: 3aa7ee1b3afa01f1637007b250a8c89883523538ac299edd982fef0dcdfd8aca
translation-status: translated
-->


TanStack Query（此前名为 React Query）常被描述为 Web 应用中缺失的数据获取库。更技术一点地说，它让你在 Web 应用里进行**服务端状态的获取、缓存、同步与更新**变得非常轻松。

## 动机

大多数核心 Web 框架**并没有**提供一种对数据获取与更新进行整体管理的强约定方案。因此，开发者往往要么构建带有严格数据获取观点的元框架，要么自行发明一套获取数据的方法。通常这意味着把组件状态与副作用拼凑在一起，或者使用更通用的状态管理库来存储并分发应用中的异步数据。

虽然传统状态管理库在处理客户端状态时很出色，但它们在处理**异步状态或服务端状态**时通常并不理想。因为**服务端状态完全不同**。例如，服务端状态：

- 远程持久化在一个你可能无法控制或拥有的位置
- 需要通过异步 API 进行获取与更新
- 具有共享所有权，可能在你不知情时被他人修改
- 若不谨慎处理，在应用中可能很快“过期”

当你理解了应用中服务端状态的特性后，随着开发推进会出现**更多挑战**，例如：

- 缓存……（可能是编程里最难的事情之一）
- 将同一数据的多个请求去重为一次请求
- 在后台更新“过期”数据
- 判断数据何时“过期”
- 尽可能快地把数据更新反映到界面
- 分页、懒加载等性能优化
- 管理服务端状态的内存与垃圾回收
- 通过结构共享记忆化查询结果

如果你看完这份清单还不觉得复杂，那你多半已经解决了所有服务端状态问题，值得拿奖。不过对于绝大多数人来说，以上挑战中的大部分都还没真正被解决，而这还只是冰山一角。

TanStack Query 毫无疑问是管理服务端状态的_最佳_库之一。它开箱即用、零配置，并且可以随着应用增长按需定制。

TanStack Query 能帮助你攻克 _服务端状态_ 的复杂问题，在数据开始“控制你”之前先把它“控制住”。

更技术化地说，TanStack Query 通常可以：

- 帮你从应用中移除**大量**复杂且容易被误解的代码，只用少量 TanStack Query 逻辑替代
- 让应用更易维护，新增功能时不必担心如何接入新的服务端状态数据源
- 直接改善终端用户体验，让应用比以往更快、更灵敏
- 有机会帮你节省带宽并提升内存性能

[//]: # 'Example'

## 说了这么多，先看代码吧！

下面的示例展示了 TanStack Query 最基础、最简单的用法：获取 TanStack Query GitHub 项目的统计信息。

[Open in StackBlitz](https://stackblitz.com/github/TanStack/query/tree/main/examples/react/simple)

```tsx
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}

function Example() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}
```

[//]: # 'Example'
[//]: # 'Materials'

## 你已经被说服了，接下来做什么？

- 可以考虑参加官方 [TanStack Query Course](https://query.gg?s=tanstack)（也可以给整个团队购买）
- 通过我们的完整 [Walkthrough Guide](../installation.md) 和 [API Reference](../reference/useQuery.md)，按自己的节奏学习 TanStack Query
- 阅读社区资源中的 [Why You Want React Query](../community/tkdodos-blog.md#23-why-you-want-react-query)

[//]: # 'Materials'
