# Terminology Baseline (EN -> ZH)

| English | Chinese |
|---|---|
| Query | 查询 |
| Mutation | 变更 |
| Query Key | 查询键 |
| Query Function | 查询函数 |
| Query Client | Query Client（客户端实例） |
| Cache | 缓存 |
| Invalidate | 失效 |
| Refetch | 重新获取 |
| Stale | 过期 |
| Fresh | 新鲜（未过期） |
| Retry | 重试 |
| Placeholder Data | 占位数据 |
| Initial Data | 初始数据 |
| Optimistic Update | 乐观更新 |
| Dependent Queries | 依赖查询 |
| Infinite Query | 无限查询 |
| Suspense | Suspense |
| Hydration | 水合 |
| Server-Side Rendering (SSR) | 服务端渲染（SSR） |
| Render Optimization | 渲染优化 |
| Background Fetching | 后台获取 |
| Garbage Collection (gcTime) | 垃圾回收（gcTime） |

## Notes

- Keep type names, hook names, and option keys in English.
- Keep `queryKey`, `queryFn`, `staleTime`, `gcTime` unchanged in text and code.

- `stale` means eligible for freshness checks/refetch triggers, not deleted or unusable.
- `out-of-date` in cancellation prose is not the `staleTime` timer expiring.
- `persisted to the cache` means 写入/保存在查询缓存中; reserve 持久化 for external storage.
- Prefetch = 预取; Effect = Effect; initial loading without cached data = 初始加载状态.
- A server `React.cache` instance is shared within a request, not a process-wide singleton.
