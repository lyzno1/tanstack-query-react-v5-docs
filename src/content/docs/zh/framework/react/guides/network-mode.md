---
id: network-mode
title: 网络模式
---

<!--
translation-source-path: framework/react/guides/network-mode.md
translation-source-ref: v5.90.3
translation-source-hash: 0bc75cad2b61e222074a2d4dbca68f333e5773d3d90f55d3eddd11f7853e00aa
translation-status: translated
-->


TanStack Query 提供了三种不同的网络模式，用于区分在没有网络连接时 [Queries](../queries.md) 和 [Mutations](../mutations.md) 应如何表现。可以为每个查询/变更单独设置此模式，也可以通过查询/变更默认值进行全局设置。

由于 TanStack Query 最常与数据获取库结合使用来获取数据，因此默认网络模式为 [online](#network-mode-online)。

## 网络模式: 在线

在此模式下，除非有网络连接，否则不会触发查询和变更。这是默认模式。如果为查询启动提取，并且由于没有网络连接而无法进行提取，则它将始终保留在其所在的 `state`（`pending`、`error`、`success`）中。然而，[fetchStatus](../queries.md#fetchstatus) 额外暴露。这可以是：

- `fetching`：`queryFn` 确实正在执行 - 请求正在进行中。
- `paused`：查询未执行 - 它处于 `paused`，直到您再次建立连接。
- `idle`：查询未获取且未暂停

标志 `isFetching` 和 `isPaused` 源自该状态，并为方便使用而暴露。

> 请记住，检查 `pending` 状态来显示加载指示器可能还不够。查询可以在 `state: 'pending'` 中，但如果是第一次挂载，并且没有网络连接，则可以在 `fetchStatus: 'paused'` 中。

如果查询因为您在线而运行，但在获取仍在发生时离线，TanStack Query 也会暂停重试机制。一旦您重新获得网络连接，暂停的查询将继续运行。这独立于`refetchOnReconnect`（在此模式下也默认为`true`），因为它不是`refetch`，而是`continue`。如果查询期间已经[cancelled](../query-cancellation.md)，则不会继续。

## 网络模式：始终

在此模式下，TanStack Query 将始终获取并忽略在线/离线状态。如果您在不需要活动网络连接来使查询工作的环境中使用 TanStack Query，则这可能是您想要选择的模式 - 例如如果您只是从`AsyncStorage`读取，或者如果您只想从`queryFn`返回`Promise.resolve(5)`。

- 查询永远不会是`paused`，因为您没有网络连接。
- 重试也不会暂停 - 如果失败，您的查询将进入 `error` 状态。
- 在此模式下，`refetchOnReconnect` 默认为`false`，因为重新连接到网络不再是应重新获取过时查询的良好指示。如果需要，您仍然可以将其打开。

## 网络模式：离线优先

此模式是前两个选项之间的中间立场，其中 TanStack Query 将运行 `queryFn` 一次，但然后暂停重试。如果您有一个 Service Worker 拦截像 [offline-first PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers) 中的缓存请求，或者如果您通过 [Cache-Control header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#the_cache-control_header) 使用 HTTP 缓存，那么这会非常方便。

在这些情况下，第一次提取可能会成功，因为它来自脱机存储/缓存。但是，如果存在缓存未命中，网络请求将退出并失败，在这种情况下，此模式的行为类似于 `online` 查询 - 暂停重试。

## 开发工具

如果要提取，但没有网络连接，[TanStack Query Devtools](../../devtools.md) 将显示处于 `paused` 状态的查询。还有一个切换按钮可以_模拟离线行为_。请注意，此按钮实际上不会干扰您的网络连接（您可以在浏览器开发工具中执行此操作），但它会将 [OnlineManager](../../../../reference/onlineManager.md) 设置为离线状态。

## 签名

- `networkMode: 'online' | 'always' | 'offlineFirst'`
  - 可选
  - 默认为`'online'`
