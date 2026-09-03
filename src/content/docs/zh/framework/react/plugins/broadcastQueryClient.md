---
id: broadcastQueryClient
title: broadcastQueryClient (Experimental)
---

<!--
translation-source-path: framework/react/plugins/broadcastQueryClient.md
translation-source-ref: main
translation-source-hash: ee7a7fcdca99ee87f06f87689e4584c7301f3562440e373eebf9be9f5f7c11e7
translation-status: translated
-->


> 非常重要：该工具目前处于实验阶段。这意味着次版本和补丁版本都可能出现破坏性变更。请自行承担使用风险。如果你选择在生产环境依赖该实验功能，请将版本锁定到具体补丁版本，以避免意外中断。

`broadcastQueryClient` 是一个实用工具，用于在同源的浏览器标签页和窗口之间广播并同步 Query Client 的状态。

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
  /** 要同步的 QueryClient */
  queryClient: QueryClient
  /** 用于在标签页和窗口之间通信的唯一频道名称 */
  broadcastChannel?: string
  /** BroadcastChannel API 的选项 */
  options?: BroadcastChannelOptions
  /**
   * 查询事件无法广播到其他标签页时调用。最常见的原因是查询的数据、错误或键中
   * 包含结构化克隆算法无法序列化的值（例如 `ReadableStream`、`File`、函数或
   * Vue `reactive` 代理）。
   *
   * 如果省略，开发环境会输出 `console.warn`，确保失败不会完全静默。
   * 可以返回 `Promise`；其 rejection 会在内部捕获。
   */
  onBroadcastError?: (
    error: unknown,
    event: BroadcastErrorEvent,
  ) => void | Promise<void>
}

interface BroadcastErrorEvent {
  type: 'updated' | 'removed' | 'added'
  queryHash: string
  queryKey: QueryKey
}
```

默认选项为：

```tsx
{
  broadcastChannel = 'tanstack-query',
}
```

## 处理广播错误

如果缓存中可能存放无法由结构化克隆算法处理的值，例如 `ReadableStream`（来自 `Response.body`、流式 API 或 AI SDK）、`File`、函数，或者 Vue `reactive` 之类的框架代理，那么底层的 `BroadcastChannel.postMessage` 调用会针对该查询失败。这个查询会跳过跨标签页同步，缓存中的其余查询仍会照常广播。

默认情况下，开发环境会输出 `console.warn`，确保失败不会完全静默。你可以提供 `onBroadcastError`，将错误交给自己的错误追踪服务：

```tsx
import * as Sentry from '@sentry/browser'
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'

broadcastQueryClient({
  queryClient,
  broadcastChannel: 'my-app',
  onBroadcastError: (error, event) => {
    Sentry.captureException(error, {
      tags: { broadcastEvent: event.type },
      extra: { queryHash: event.queryHash, queryKey: event.queryKey },
    })
  },
})
```
