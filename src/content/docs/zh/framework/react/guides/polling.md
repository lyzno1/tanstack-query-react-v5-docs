---
id: polling
title: 轮询
---

<!--
translation-source-path: framework/react/guides/polling.md
translation-source-ref: main
translation-source-hash: 4ca50ab200e96b4c99d65c77d1e7541a81cd4985ab64d50d08c4ea8e948bf9f5
translation-status: translated
-->


`refetchInterval` 可让查询按定时器重新获取数据。将其设为以毫秒为单位的数值后，只要至少有一个活跃观察者，查询就会每隔 N 毫秒运行一次：

[//]: # 'Example1'

```tsx
useQuery({
  queryKey: ['prices'],
  queryFn: fetchPrices,
  refetchInterval: 5_000, // every 5 seconds
})
```

[//]: # 'Example1'

轮询与 `staleTime` 相互独立。即使查询仍处于新鲜状态，也会按计划轮询。关于 `staleTime` 如何与其他重新获取行为协同工作，请参阅[重要的默认配置](./important-defaults.md)。无论数据是否新鲜，`refetchInterval` 都按自己的计时周期触发。

## 根据查询状态调整间隔

除了数值，你也可以传入函数，根据当前查询动态计算间隔。该函数接收 `Query` 对象，并应返回以毫秒为单位的数值；返回 `false` 则停止轮询：

[//]: # 'Example2'

```tsx
useQuery({
  queryKey: ['job', jobId],
  queryFn: () => fetchJobStatus(jobId),
  refetchInterval: (query) => {
    // Stop polling once the job finishes
    if (query.state.data?.status === 'complete') return false
    return 2_000
  },
})
```

[//]: # 'Example2'

返回 `false` 会清除间隔定时器。如果查询结果之后发生变化，使该函数重新返回正数，轮询会自动恢复。

## 后台轮询

默认情况下，浏览器标签页失去焦点后，轮询会暂停。对于仪表盘等即使用户切换到其他标签页也需要保持数据最新的界面，可以禁用这一行为：

[//]: # 'Example3'

```tsx
useQuery({
  queryKey: ['portfolio'],
  queryFn: fetchPortfolio,
  refetchInterval: 30_000,
  refetchIntervalInBackground: true,
})
```

[//]: # 'Example3'

## 暂停轮询

向 `refetchInterval` 传入函数，并在闭包中读取组件状态，即可控制何时进行轮询：

[//]: # 'Example4'

```tsx
useQuery({
  queryKey: ['prices', tokenAddress],
  queryFn: () => fetchPrice(tokenAddress),
  refetchInterval: () => {
    if (!tokenAddress || isPaused) return false
    return 15_000
  },
})
```

[//]: # 'Example4'

## 支持离线状态的轮询

TanStack Query 会监听浏览器的 `online` 和 `offline` 事件来检测网络连接。在 Electron、部分嵌入式 WebView 等无法可靠触发这些事件的环境中，可设置 `networkMode: 'always'` 跳过网络连接检查：

[//]: # 'Example5'

```tsx
useQuery({
  queryKey: ['chainStatus'],
  queryFn: fetchChainStatus,
  refetchInterval: 10_000,
  networkMode: 'always',
})
```

[//]: # 'Example5'

有关网络模式的更多信息，请参阅[网络模式](./network-mode.md)。

## 关于请求去重

每个 `QueryObserver`（即每个使用带有 `refetchInterval` 的 `useQuery` 的组件）都有自己的定时器。若两个组件订阅同一个查询键，并且都设置了 `refetchInterval: 5000`，它们各自的定时器都会每 5 秒触发一次。被去重的是同时进行中的获取请求：如果两个定时器在同一时刻触发，只会发出一个网络请求。换言之，定时器属于观察者级别，而请求去重发生在查询级别。

[//]: # 'ReactNative'

## 非浏览器环境

在 React Native 等非浏览器运行时中，标准的 `online`、`offline` 和焦点事件并不可用。[React Native 指南](../react-native.md)介绍了如何将 `focusManager` 和 `onlineManager` 接入原生应用状态 API。

[//]: # 'ReactNative'
