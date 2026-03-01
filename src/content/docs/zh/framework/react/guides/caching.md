---
id: caching
title: 缓存示例
---

<!--
translation-source-path: framework/react/guides/caching.md
translation-source-ref: v5.90.3
translation-source-hash: 9001989b7ed68c70aa3873fd110104718d55392121e9238647578fa5316e0dba
translation-status: translated
-->


> 在阅读本指南之前，请先完整阅读[重要默认值](../important-defaults.md)

## 基础示例

这个缓存示例展示了以下内容的流程与生命周期：

- 有缓存数据与无缓存数据时的查询实例
- 后台重新获取
- 非活跃查询
- 垃圾回收

假设我们使用默认 `gcTime`（**5 分钟**）和默认 `staleTime`（`0`）。

- 一个新的 `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` 实例被挂载。
  - 由于此前没有使用 `['todos']` 查询键发起过其他查询，这个查询会先显示硬加载状态，并发起网络请求获取数据。
  - 网络请求完成后，返回的数据会缓存到 `['todos']` 键下。
  - hook 会在配置的 `staleTime` 到期后将数据标记为过期（默认是 `0`，即立即过期）。
- 在其他位置又挂载了第二个 `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` 实例。
  - 由于缓存里已经有第一个查询留下的 `['todos']` 数据，该数据会立刻从缓存返回。
  - 新实例会使用它自己的查询函数再次触发网络请求。
    - 注意：无论两个 `fetchTodos` 查询函数是否完全相同，由于它们使用同一个查询键，两个查询的 [`status`](../../reference/useQuery.md)（包括 `isFetching`、`isPending` 以及其他相关值）都会更新。
  - 请求成功完成后，缓存中 `['todos']` 键下的数据会被新数据更新，两个实例都会收到新数据。
- 两个 `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` 查询实例都被卸载，不再使用。
  - 由于这个查询已没有活跃实例，会基于 `gcTime` 启动垃圾回收计时器来删除并回收该查询（默认 **5 分钟**）。
- 在缓存超时结束前，又挂载了一个 `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` 实例。查询会立即返回当前可用的缓存数据，同时在后台运行 `fetchTodos` 函数。成功完成后，缓存会填充为最新数据。
- 最后一个 `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` 实例卸载。
- 在 **5 分钟** 内没有再出现新的 `useQuery({ queryKey: ['todos'], queryFn: fetchTodos })` 实例。
  - `['todos']` 键下的缓存数据会被删除并垃圾回收。
