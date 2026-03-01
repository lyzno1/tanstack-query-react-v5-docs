---
id: broadcastQueryClient
title: broadcastQueryClient (Experimental)
---

<!--
translation-source-path: framework/react/plugins/broadcastQueryClient.md
translation-source-ref: v5.90.3
translation-source-hash: e0a64b9939bca6b14d25c1f0071bf4642afbe5e15986efd76d0ce830541cc935
translation-status: translated
-->


> 非常重要：该工具目前处于实验阶段。这意味着次版本和补丁版本都可能出现破坏性变更。请自行承担使用风险。如果你选择在生产环境依赖该实验功能，请将版本锁定到具体补丁版本，以避免意外中断。

`broadcastQueryClient` 是一个实用工具，用于在同源的浏览器标签页/窗口之间广播并同步你的 `queryClient` 状态。

## 安装

该工具以独立包形式提供，可通过 `'@tanstack/query-broadcast-client-experimental'` 导入。

## 用法

导入 `broadcastQueryClient` 函数，传入你的 `QueryClient` 实例，并可选设置 `broadcastChannel`。

```tsx
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'

const queryClient = new QueryClient()

broadcastQueryClient({
  queryClient,
  broadcastChannel: 'my-app',
})
```

## API

### `broadcastQueryClient`

向该函数传入 `QueryClient` 实例，以及可选的 `broadcastChannel`。

```tsx
broadcastQueryClient({ queryClient, broadcastChannel })
```

### `Options`

选项对象如下：

```tsx
interface BroadcastQueryClientOptions {
  /** The QueryClient to sync */
  queryClient: QueryClient
  /** This is the unique channel name that will be used
   * to communicate between tabs and windows */
  broadcastChannel?: string
  /** Options for the BroadcastChannel API */
  options?: BroadcastChannelOptions
}
```

默认选项为：

```tsx
{
  broadcastChannel = 'tanstack-query',
}
```
