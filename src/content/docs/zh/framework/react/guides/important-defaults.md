---
id: important-defaults
title: 重要默认值
---

<!--
translation-source-path: framework/react/guides/important-defaults.md
translation-source-ref: v5.90.3
translation-source-hash: 8b2f7a5752c576e87fb22f5365fce6592540ea9313dcbd3a9d4ceb7faa866c34
translation-status: translated
-->


开箱即用时，TanStack Query 采用的是一套**激进但合理**的默认配置。**如果不了解这些默认行为，它们有时会让新用户感到意外，也会让学习/调试变得困难。** 在你继续学习和使用 TanStack Query 时，请记住以下几点：

- 通过 `useQuery` 或 `useInfiniteQuery` 创建的查询实例，默认会将缓存数据视为**过期**。

> 若要改变此行为，你可以在全局或单个查询级别通过 `staleTime` 进行配置。设置更长的 `staleTime` 意味着查询不会频繁重新获取数据。

- 设置了 `staleTime` 的查询在该时间到期前会被视为**新鲜（未过期）**。
  - 例如将 `staleTime` 设为 `2 * 60 * 1000`，可确保 2 分钟内（或在查询被[手动失效](../query-invalidation.md)之前）都从缓存读取，不触发任何重新获取。
  - 将 `staleTime` 设为 `Infinity`，则在查询被[手动失效](../query-invalidation.md)前永不触发重新获取。
  - 将 `staleTime` 设为 `'static'`，则即使查询被[手动失效](../query-invalidation.md)，也**永不**触发重新获取。

- 过期查询会在以下时机自动后台重新获取：
  - 新的查询实例挂载时
  - 窗口重新获得焦点时
  - 网络重新连接时

> 通过设置 `staleTime` 是避免过度重新获取的推荐方式，但你也可以通过 `refetchOnMount`、`refetchOnWindowFocus`、`refetchOnReconnect` 等选项自定义重新获取触发时机。

- 查询还可以通过 `refetchInterval` 配置周期性重新获取，这与 `staleTime` 设置无关。

- 不再有活跃 `useQuery`、`useInfiniteQuery` 或查询观察者实例的查询结果会被标记为“inactive（非活跃）”，并保留在缓存中，以便后续复用。
- 默认情况下，“inactive” 查询会在 **5 分钟**后被垃圾回收。

  > 如需调整，可将查询的默认 `gcTime` 改为非 `1000 * 60 * 5` 毫秒的值。

- 查询失败后，在将错误捕获并显示到 UI 之前，默认会**静默重试 3 次，并采用指数退避延迟**。

  > 如需调整，可将查询默认 `retry` 和 `retryDelay` 选项改为非 `3` 及默认指数退避函数。

- 查询结果默认会进行**结构共享（structural sharing）**，用于检测数据是否真的发生变化；若未变化，**数据引用保持不变**，这有助于 `useMemo` 和 `useCallback` 的值稳定。如果你对这个概念不熟悉也没关系。99.9% 的情况下你不需要关闭它，并且它几乎零成本提升应用性能。

  > 结构共享只对 JSON 兼容值生效，其他类型始终会被视为变化。如果你因大体积响应而遇到性能问题，可通过 `config.structuralSharing` 关闭此特性。如果你的查询响应包含非 JSON 兼容值，但仍希望检测数据是否变化，可以将自定义函数传给 `config.structuralSharing`，基于新旧响应计算并按需保留引用。

[//]: # 'Materials'

## 延伸阅读

想进一步了解这些默认行为，可参考社区资源中的以下文章：

- [Practical React Query](../../community/tkdodos-blog.md#1-practical-react-query)
- [React Query as a State Manager](../../community/tkdodos-blog.md#10-react-query-as-a-state-manager)
- [Thinking in React Query](../../community/tkdodos-blog.md#21-thinking-in-react-query)

[//]: # 'Materials'
