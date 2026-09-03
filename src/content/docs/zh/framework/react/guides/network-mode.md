---
id: network-mode
title: 网络模式
---

<!--
translation-source-path: framework/react/guides/network-mode.md
translation-source-ref: main
translation-source-hash: 713fae3317d926526999ea809f08f94a5b03875c2ff00f3281da5d2a0e90f865
translation-status: translated
-->


TanStack Query 提供了三种网络模式，用于决定没有网络连接时[查询](./queries.md)和[变更](./mutations.md)应如何运行。你可以为每个查询或变更单独设置此模式，也可以通过查询或变更的默认选项进行全局配置。

由于 TanStack Query 最常与数据获取库结合使用来获取数据，因此默认网络模式为 [online](#network-mode-online)。

## 网络模式：online

在此模式下，只有连接网络后才会执行查询和变更。这是默认模式。如果查询已开始获取，却因没有网络连接而无法发出请求，它会继续保持当前的 `state`（`pending`、`error` 或 `success`）。除此之外，还会提供一个 [`fetchStatus`](./queries.md#fetchstatus)，可能的值包括：

- `fetching`：`queryFn` 正在实际执行，请求进行中。
- `paused`：查询没有执行，会一直暂停到网络重新连接。
- `idle`：查询既未获取，也未暂停。

`isFetching` 和 `isPaused` 就是从这个状态派生出来的便利标志。

> 请注意，仅检查 `pending` 状态可能不足以决定是否显示加载指示器。如果查询首次挂载时没有网络连接，它可能同时处于 `state: 'pending'` 和 `fetchStatus: 'paused'`。

如果查询在联网时开始执行，但在获取期间断开了网络，TanStack Query 还会暂停重试机制。网络恢复后，被暂停的查询会继续执行。这与 `refetchOnReconnect`（此模式下默认为 `true`）无关，因为这不是一次 `refetch`，而是一次 `continue`。如果查询在此期间已被[取消](./query-cancellation.md)，它就不会继续执行。

## 网络模式：always

在此模式下，TanStack Query 始终会执行获取，并忽略网络在线或离线状态。如果查询无需活跃的网络连接也能工作，这通常是合适的模式。例如，你可能只从 `AsyncStorage` 读取数据，或者只想从 `queryFn` 返回 `Promise.resolve(5)`。

- 查询永远不会因缺少网络连接而处于 `paused` 状态。
- 重试也不会暂停。如果重试失败，查询会进入 `error` 状态。
- 此模式下，`refetchOnReconnect` 默认为 `false`，因为重新连接网络不再能有效表明应该重新获取过期查询。如有需要，你仍然可以将它开启。

## 网络模式：offlineFirst

此模式介于前两种模式之间：TanStack Query 会先执行一次 `queryFn`，如果失败则暂停重试。如果有 Service Worker 像 [offline-first PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers) 那样拦截请求并从缓存返回内容，或者你通过 [Cache-Control header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching#the_cache-control_header) 使用 HTTP 缓存，这种模式会非常有用。

在这些情况下，首次获取可能会成功，因为数据来自离线存储或缓存。如果缓存未命中，则会发出网络请求并且请求会失败。此时它的行为与 `online` 查询相同，会暂停重试。

## 开发工具

如果查询本应正在获取，却因没有网络连接而无法执行，[TanStack Query Devtools](../devtools.md) 会将其显示为 `paused` 状态。Devtools 还提供了用于_模拟离线行为_的切换按钮。请注意，此按钮并不会真正改变网络连接（你可以在浏览器 DevTools 中进行这种操作），而只会将 [OnlineManager](../../../reference/onlineManager.md) 设为离线状态。

## 签名

- `networkMode: 'online' | 'always' | 'offlineFirst'`
  - 可选
  - 默认为 `'online'`
