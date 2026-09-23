# Terminology Baseline (EN -> ZH)

| English | Chinese |
|---|---|
| Query | 查询 |
| Mutation / mutations | mutation（复数仍写 mutation） |
| Mutate | `mutate`（API）或“执行 mutation”（动作） |
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
| Hydration / hydrate | hydration（过程）/ `hydrate`（API 或动作） |
| Dehydration / dehydrate | dehydration（过程）/ `dehydrate`（API 或动作） |
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
- Keep `mutation`, `mutate`, `hydration`, `hydrate`, `dehydrate`, and `dehydration` recognizable in prose and headings. Do not translate a mutation as “变更” or hydration as “水合”. Ordinary Chinese uses of 变更, such as “破坏性变更” and “类型变更”, remain unchanged.
- Preserve API spellings (`useMutation`, `mutationFn`, `HydrationBoundary`, etc.). Use `mutation` for the TanStack Query concept and `mutate` for the method or invocation, rather than treating them as synonyms.
