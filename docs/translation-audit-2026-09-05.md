# 中文文档全量核对记录（2026-09-05）

本次以 TanStack/query `main` 的 `1893a965d219032207cbe147880d0e9f757a5a56` 为基准，覆盖 manifest 中全部 **139 篇**文档，而非仅核对哈希过期的两篇。另检查了站点中文首页，生成 25 个中文示例入口与中文同步状态页。

## 核对方法与范围

- 对照中英文正文、标题、列表、表格、参数说明、默认值、返回值、代码及边界条件；旧版迁移指南保留对应历史版本的 API。
- 区分过期与失效、缓存与外部持久化、请求与重试、服务端请求作用域与全局单例，以及 Suspense/SSR 的渲染阶段。
- 对上游自身的明确矛盾，核对同一提交的 `query-core` 实现，并以译注说明；同步下来的英文源文件未手动改写。
- 自动检查负责页面覆盖、源哈希、草稿标记、标题结构、代码块结构、生成页面和站内链接。它不能证明语义正确；逐页审阅与自动检查是两项不同的工作。

## 主要修复

- `advanced-ssr`：将错误的全局单例说明改为同一请求内共享实例，澄清加载阶段与应用阶段。
- `ssr`、v4 迁移：区分 React Query 的缓存回收定时器与 JavaScript 运行时垃圾回收，去掉请求结束立即清空所有内存的误导。
- `render-optimizations`：补全“已使用的属性发生变化才触发查询驱动的重渲染”；对照实现区分 `select` 返回 Error 与抛出错误。
- `query-cancellation`、`infinite-queries`：取消不是 `staleTime` 到期；`cancelRefetch: false` 复用正在进行的获取，并非启用并发。
- `placeholder-query-data`、`initial-query-data`、`caching`：统一缓存语义，明确占位数据不写入查询缓存，也不是 QueryClient 的命令式获取选项。
- `important-defaults`、`query-retries`、`scroll-restoration`：明确 static 的边界、请求/重试次数，以及实际滚动恢复由路由器负责。
- `testing`、`suspense`：核对最近上游更新，修复 URL 笔误、旧 React 测试背景说明和原生 button 示例同步。
- 核心参考：修正 resetQueries 的初始状态、cancelQueries 的 Promise 返回说明及计时单位；在构建层补充上游缺失的 getQueryData 段落，上游恢复时自动停用补充。
- 插件、TypeScript、比较表、ESLint、预取等页面：修正状态字段、术语和说明；不改写历史迁移示例的 API。
- 社区资源原来只有 frontmatter，页面正文为空；现在将资源渲染为四个可读分组，并加入导航。复制 Markdown 同样包含社区资源和本站补充内容。
- 修复按文件解析的相对链接、Starlight index 路由和中文标题锚点；中文页面保留上游锚点 ID。补齐中文示例标题、导航分组及复制按钮文案。

## 维护方式

- 每日同步先执行类型检查、lint、翻译完整性、维护脚本回归测试、构建和站内链接检查。全部通过才尝试推送 main；失败或受分支保护阻止时更新固定分支 PR，避免每天新增 PR。
- 不自动刷新翻译哈希，不自动声称翻译已完成。英文新增/修改需要审阅时，仍保留一个待处理 PR。这是避免 main 长期混入缺失或过期译文的必要边界。
- 将 CI 使用的 i18n 脚本移入 scripts；记录审核必须显式指定 `--path` 或 `--all-reviewed`，且不会连带确认未审阅页面。
- 删除重复的页内翻译来源标记，统一以 `upstream/i18n.zh.json` 记录来源；不将哈希一致误当成译文质量保证。
- 按 OpenAI 关于 AGENTS.md 与 skills 的职责划分，更新仓库约定，保留精简的翻译 skill，移除无关 UI/UX skill 及锁文件。README 修正为实际的上游 main 跟踪策略。

## 验证

- `pnpm i18n:check`：139 篇有效，缺失/过期/孤立项均为 0；139 篇标题与代码块结构检查通过。
- `pnpm test:maintenance`：3 个回归测试通过，覆盖部分审阅不会放行其他页面、草稿拒绝、中文链接/锚点和社区资源渲染。
- `pnpm check`：0 errors、0 warnings，保留原有剪贴板兼容回退的 1 个弃用提示。`pnpm lint`、`pnpm build` 和 `git diff --check` 均通过；333 个构建页面的 62,233 处站内链接及锚点全部通过检查。
- 链接检查覆盖生成 HTML 中的站内页面及锚点，不将第三方网站的可用性视为构建保证。

## 逐页核对清单

下表的“修订”指正文或 frontmatter 变化，不包括仅清除重复元数据标记。保留现有译文的页面同样纳入全文核对；本次没有为了制造修改量而重写正确内容。

| 文档 | 结果 |
| --- | --- |
| [community-resources.md](../src/content/docs/zh/community-resources.md) | 已核对，保留现有译文 |
| [eslint/eslint-plugin-query.md](../src/content/docs/zh/eslint/eslint-plugin-query.md) | 已核对，保留现有译文 |
| [eslint/exhaustive-deps.md](../src/content/docs/zh/eslint/exhaustive-deps.md) | 已核对并修订 |
| [eslint/infinite-query-property-order.md](../src/content/docs/zh/eslint/infinite-query-property-order.md) | 已核对并修订 |
| [eslint/mutation-property-order.md](../src/content/docs/zh/eslint/mutation-property-order.md) | 已核对并修订 |
| [eslint/no-rest-destructuring.md](../src/content/docs/zh/eslint/no-rest-destructuring.md) | 已核对并修订 |
| [eslint/no-unstable-deps.md](../src/content/docs/zh/eslint/no-unstable-deps.md) | 已核对并修订 |
| [eslint/no-void-query-fn.md](../src/content/docs/zh/eslint/no-void-query-fn.md) | 已核对并修订 |
| [eslint/prefer-query-options.md](../src/content/docs/zh/eslint/prefer-query-options.md) | 已核对并修订 |
| [eslint/stable-query-client.md](../src/content/docs/zh/eslint/stable-query-client.md) | 已核对并修订 |
| [framework/react/comparison.md](../src/content/docs/zh/framework/react/comparison.md) | 已核对并修订 |
| [framework/react/devtools.md](../src/content/docs/zh/framework/react/devtools.md) | 已核对，保留现有译文 |
| [framework/react/graphql.md](../src/content/docs/zh/framework/react/graphql.md) | 已核对，保留现有译文 |
| [framework/react/guides/advanced-ssr.md](../src/content/docs/zh/framework/react/guides/advanced-ssr.md) | 已核对并修订 |
| [framework/react/guides/background-fetching-indicators.md](../src/content/docs/zh/framework/react/guides/background-fetching-indicators.md) | 已核对并修订 |
| [framework/react/guides/caching.md](../src/content/docs/zh/framework/react/guides/caching.md) | 已核对并修订 |
| [framework/react/guides/default-query-function.md](../src/content/docs/zh/framework/react/guides/default-query-function.md) | 已核对，保留现有译文 |
| [framework/react/guides/dependent-queries.md](../src/content/docs/zh/framework/react/guides/dependent-queries.md) | 已核对，保留现有译文 |
| [framework/react/guides/disabling-queries.md](../src/content/docs/zh/framework/react/guides/disabling-queries.md) | 已核对，保留现有译文 |
| [framework/react/guides/does-this-replace-client-state.md](../src/content/docs/zh/framework/react/guides/does-this-replace-client-state.md) | 已核对，保留现有译文 |
| [framework/react/guides/filters.md](../src/content/docs/zh/framework/react/guides/filters.md) | 已核对，保留现有译文 |
| [framework/react/guides/important-defaults.md](../src/content/docs/zh/framework/react/guides/important-defaults.md) | 已核对并修订 |
| [framework/react/guides/infinite-queries.md](../src/content/docs/zh/framework/react/guides/infinite-queries.md) | 已核对并修订 |
| [framework/react/guides/initial-query-data.md](../src/content/docs/zh/framework/react/guides/initial-query-data.md) | 已核对并修订 |
| [framework/react/guides/invalidations-from-mutations.md](../src/content/docs/zh/framework/react/guides/invalidations-from-mutations.md) | 已核对，保留现有译文 |
| [framework/react/guides/migrating-to-react-query-3.md](../src/content/docs/zh/framework/react/guides/migrating-to-react-query-3.md) | 已核对，保留现有译文 |
| [framework/react/guides/migrating-to-react-query-4.md](../src/content/docs/zh/framework/react/guides/migrating-to-react-query-4.md) | 已核对并修订 |
| [framework/react/guides/migrating-to-v5.md](../src/content/docs/zh/framework/react/guides/migrating-to-v5.md) | 已核对并修订 |
| [framework/react/guides/mutations.md](../src/content/docs/zh/framework/react/guides/mutations.md) | 已核对，保留现有译文 |
| [framework/react/guides/network-mode.md](../src/content/docs/zh/framework/react/guides/network-mode.md) | 已核对并修订 |
| [framework/react/guides/optimistic-updates.md](../src/content/docs/zh/framework/react/guides/optimistic-updates.md) | 已核对，保留现有译文 |
| [framework/react/guides/paginated-queries.md](../src/content/docs/zh/framework/react/guides/paginated-queries.md) | 已核对，保留现有译文 |
| [framework/react/guides/parallel-queries.md](../src/content/docs/zh/framework/react/guides/parallel-queries.md) | 已核对，保留现有译文 |
| [framework/react/guides/placeholder-query-data.md](../src/content/docs/zh/framework/react/guides/placeholder-query-data.md) | 已核对并修订 |
| [framework/react/guides/polling.md](../src/content/docs/zh/framework/react/guides/polling.md) | 已核对，保留现有译文 |
| [framework/react/guides/prefetching.md](../src/content/docs/zh/framework/react/guides/prefetching.md) | 已核对并修订 |
| [framework/react/guides/queries.md](../src/content/docs/zh/framework/react/guides/queries.md) | 已核对，保留现有译文 |
| [framework/react/guides/query-cancellation.md](../src/content/docs/zh/framework/react/guides/query-cancellation.md) | 已核对并修订 |
| [framework/react/guides/query-functions.md](../src/content/docs/zh/framework/react/guides/query-functions.md) | 已核对，保留现有译文 |
| [framework/react/guides/query-invalidation.md](../src/content/docs/zh/framework/react/guides/query-invalidation.md) | 已核对，保留现有译文 |
| [framework/react/guides/query-keys.md](../src/content/docs/zh/framework/react/guides/query-keys.md) | 已核对，保留现有译文 |
| [framework/react/guides/query-options.md](../src/content/docs/zh/framework/react/guides/query-options.md) | 已核对，保留现有译文 |
| [framework/react/guides/query-retries.md](../src/content/docs/zh/framework/react/guides/query-retries.md) | 已核对并修订 |
| [framework/react/guides/render-optimizations.md](../src/content/docs/zh/framework/react/guides/render-optimizations.md) | 已核对并修订 |
| [framework/react/guides/request-waterfalls.md](../src/content/docs/zh/framework/react/guides/request-waterfalls.md) | 已核对，保留现有译文 |
| [framework/react/guides/scroll-restoration.md](../src/content/docs/zh/framework/react/guides/scroll-restoration.md) | 已核对并修订 |
| [framework/react/guides/ssr.md](../src/content/docs/zh/framework/react/guides/ssr.md) | 已核对并修订 |
| [framework/react/guides/suspense.md](../src/content/docs/zh/framework/react/guides/suspense.md) | 已核对并修订 |
| [framework/react/guides/testing.md](../src/content/docs/zh/framework/react/guides/testing.md) | 已核对并修订 |
| [framework/react/guides/updates-from-mutation-responses.md](../src/content/docs/zh/framework/react/guides/updates-from-mutation-responses.md) | 已核对，保留现有译文 |
| [framework/react/guides/window-focus-refetching.md](../src/content/docs/zh/framework/react/guides/window-focus-refetching.md) | 已核对，保留现有译文 |
| [framework/react/installation.md](../src/content/docs/zh/framework/react/installation.md) | 已核对并修订 |
| [framework/react/overview.md](../src/content/docs/zh/framework/react/overview.md) | 已核对，保留现有译文 |
| [framework/react/plugins/broadcastQueryClient.md](../src/content/docs/zh/framework/react/plugins/broadcastQueryClient.md) | 已核对，保留现有译文 |
| [framework/react/plugins/createAsyncStoragePersister.md](../src/content/docs/zh/framework/react/plugins/createAsyncStoragePersister.md) | 已核对，保留现有译文 |
| [framework/react/plugins/createPersister.md](../src/content/docs/zh/framework/react/plugins/createPersister.md) | 已核对，保留现有译文 |
| [framework/react/plugins/createSyncStoragePersister.md](../src/content/docs/zh/framework/react/plugins/createSyncStoragePersister.md) | 已核对，保留现有译文 |
| [framework/react/plugins/persistQueryClient.md](../src/content/docs/zh/framework/react/plugins/persistQueryClient.md) | 已核对并修订 |
| [framework/react/quick-start.md](../src/content/docs/zh/framework/react/quick-start.md) | 已核对，保留现有译文 |
| [framework/react/react-native.md](../src/content/docs/zh/framework/react/react-native.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/HydrationBoundary.md](../src/content/docs/zh/framework/react/reference/functions/HydrationBoundary.md) | 已核对并修订 |
| [framework/react/reference/functions/QueryClientProvider.md](../src/content/docs/zh/framework/react/reference/functions/QueryClientProvider.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/QueryErrorResetBoundary.md](../src/content/docs/zh/framework/react/reference/functions/QueryErrorResetBoundary.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/infiniteQueryOptions.md](../src/content/docs/zh/framework/react/reference/functions/infiniteQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/mutationOptions.md](../src/content/docs/zh/framework/react/reference/functions/mutationOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/queryOptions.md](../src/content/docs/zh/framework/react/reference/functions/queryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useInfiniteQuery.md](../src/content/docs/zh/framework/react/reference/functions/useInfiniteQuery.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useIsFetching.md](../src/content/docs/zh/framework/react/reference/functions/useIsFetching.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useIsMutating.md](../src/content/docs/zh/framework/react/reference/functions/useIsMutating.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useIsRestoring.md](../src/content/docs/zh/framework/react/reference/functions/useIsRestoring.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useMutation.md](../src/content/docs/zh/framework/react/reference/functions/useMutation.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useMutationState.md](../src/content/docs/zh/framework/react/reference/functions/useMutationState.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/usePrefetchInfiniteQuery.md](../src/content/docs/zh/framework/react/reference/functions/usePrefetchInfiniteQuery.md) | 已核对并修订 |
| [framework/react/reference/functions/usePrefetchQuery.md](../src/content/docs/zh/framework/react/reference/functions/usePrefetchQuery.md) | 已核对并修订 |
| [framework/react/reference/functions/useQueries.md](../src/content/docs/zh/framework/react/reference/functions/useQueries.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useQuery.md](../src/content/docs/zh/framework/react/reference/functions/useQuery.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useQueryClient.md](../src/content/docs/zh/framework/react/reference/functions/useQueryClient.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useQueryErrorResetBoundary.md](../src/content/docs/zh/framework/react/reference/functions/useQueryErrorResetBoundary.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useSuspenseInfiniteQuery.md](../src/content/docs/zh/framework/react/reference/functions/useSuspenseInfiniteQuery.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useSuspenseQueries.md](../src/content/docs/zh/framework/react/reference/functions/useSuspenseQueries.md) | 已核对，保留现有译文 |
| [framework/react/reference/functions/useSuspenseQuery.md](../src/content/docs/zh/framework/react/reference/functions/useSuspenseQuery.md) | 已核对，保留现有译文 |
| [framework/react/reference/index.md](../src/content/docs/zh/framework/react/reference/index.md) | 已核对，保留现有译文 |
| [framework/react/reference/interfaces/HydrationBoundaryProps.md](../src/content/docs/zh/framework/react/reference/interfaces/HydrationBoundaryProps.md) | 已核对，保留现有译文 |
| [framework/react/reference/interfaces/QueryErrorResetBoundaryProps.md](../src/content/docs/zh/framework/react/reference/interfaces/QueryErrorResetBoundaryProps.md) | 已核对，保留现有译文 |
| [framework/react/reference/interfaces/UseBaseQueryOptions.md](../src/content/docs/zh/framework/react/reference/interfaces/UseBaseQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/interfaces/UseInfiniteQueryOptions.md](../src/content/docs/zh/framework/react/reference/interfaces/UseInfiniteQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/interfaces/UseMutationOptions.md](../src/content/docs/zh/framework/react/reference/interfaces/UseMutationOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/interfaces/UseQueryOptions.md](../src/content/docs/zh/framework/react/reference/interfaces/UseQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/interfaces/UseSuspenseInfiniteQueryOptions.md](../src/content/docs/zh/framework/react/reference/interfaces/UseSuspenseInfiniteQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/interfaces/UseSuspenseQueryOptions.md](../src/content/docs/zh/framework/react/reference/interfaces/UseSuspenseQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/AnyUseBaseQueryOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/AnyUseBaseQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/AnyUseInfiniteQueryOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/AnyUseInfiniteQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/AnyUseMutationOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/AnyUseMutationOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/AnyUseQueryOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/AnyUseQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/AnyUseSuspenseInfiniteQueryOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/AnyUseSuspenseInfiniteQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/AnyUseSuspenseQueryOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/AnyUseSuspenseQueryOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/DefinedInitialDataInfiniteOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/DefinedInitialDataInfiniteOptions.md) | 已核对并修订 |
| [framework/react/reference/type-aliases/DefinedInitialDataOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/DefinedInitialDataOptions.md) | 已核对并修订 |
| [framework/react/reference/type-aliases/DefinedUseInfiniteQueryResult.md](../src/content/docs/zh/framework/react/reference/type-aliases/DefinedUseInfiniteQueryResult.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/DefinedUseQueryResult.md](../src/content/docs/zh/framework/react/reference/type-aliases/DefinedUseQueryResult.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/QueriesOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/QueriesOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/QueriesResults.md](../src/content/docs/zh/framework/react/reference/type-aliases/QueriesResults.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/QueryClientProviderProps.md](../src/content/docs/zh/framework/react/reference/type-aliases/QueryClientProviderProps.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/QueryErrorClearResetFunction.md](../src/content/docs/zh/framework/react/reference/type-aliases/QueryErrorClearResetFunction.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/QueryErrorIsResetFunction.md](../src/content/docs/zh/framework/react/reference/type-aliases/QueryErrorIsResetFunction.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/QueryErrorResetBoundaryFunction.md](../src/content/docs/zh/framework/react/reference/type-aliases/QueryErrorResetBoundaryFunction.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/QueryErrorResetFunction.md](../src/content/docs/zh/framework/react/reference/type-aliases/QueryErrorResetFunction.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/SuspenseQueriesOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/SuspenseQueriesOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/SuspenseQueriesResults.md](../src/content/docs/zh/framework/react/reference/type-aliases/SuspenseQueriesResults.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UndefinedInitialDataInfiniteOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/UndefinedInitialDataInfiniteOptions.md) | 已核对并修订 |
| [framework/react/reference/type-aliases/UndefinedInitialDataOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/UndefinedInitialDataOptions.md) | 已核对并修订 |
| [framework/react/reference/type-aliases/UnusedSkipTokenInfiniteOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/UnusedSkipTokenInfiniteOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UnusedSkipTokenOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/UnusedSkipTokenOptions.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UseBaseMutationResult.md](../src/content/docs/zh/framework/react/reference/type-aliases/UseBaseMutationResult.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UseBaseQueryResult.md](../src/content/docs/zh/framework/react/reference/type-aliases/UseBaseQueryResult.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UseInfiniteQueryResult.md](../src/content/docs/zh/framework/react/reference/type-aliases/UseInfiniteQueryResult.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UseMutateAsyncFunction.md](../src/content/docs/zh/framework/react/reference/type-aliases/UseMutateAsyncFunction.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UseMutateFunction.md](../src/content/docs/zh/framework/react/reference/type-aliases/UseMutateFunction.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UseMutationResult.md](../src/content/docs/zh/framework/react/reference/type-aliases/UseMutationResult.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UsePrefetchInfiniteQueryOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/UsePrefetchInfiniteQueryOptions.md) | 已核对并修订 |
| [framework/react/reference/type-aliases/UsePrefetchQueryOptions.md](../src/content/docs/zh/framework/react/reference/type-aliases/UsePrefetchQueryOptions.md) | 已核对并修订 |
| [framework/react/reference/type-aliases/UseQueryResult.md](../src/content/docs/zh/framework/react/reference/type-aliases/UseQueryResult.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UseSuspenseInfiniteQueryResult.md](../src/content/docs/zh/framework/react/reference/type-aliases/UseSuspenseInfiniteQueryResult.md) | 已核对，保留现有译文 |
| [framework/react/reference/type-aliases/UseSuspenseQueryResult.md](../src/content/docs/zh/framework/react/reference/type-aliases/UseSuspenseQueryResult.md) | 已核对，保留现有译文 |
| [framework/react/reference/variables/IsRestoringProvider.md](../src/content/docs/zh/framework/react/reference/variables/IsRestoringProvider.md) | 已核对，保留现有译文 |
| [framework/react/reference/variables/QueryClientContext.md](../src/content/docs/zh/framework/react/reference/variables/QueryClientContext.md) | 已核对，保留现有译文 |
| [framework/react/typescript.md](../src/content/docs/zh/framework/react/typescript.md) | 已核对并修订 |
| [reference/InfiniteQueryObserver.md](../src/content/docs/zh/reference/InfiniteQueryObserver.md) | 已核对，保留现有译文 |
| [reference/MutationCache.md](../src/content/docs/zh/reference/MutationCache.md) | 已核对，保留现有译文 |
| [reference/QueriesObserver.md](../src/content/docs/zh/reference/QueriesObserver.md) | 已核对，保留现有译文 |
| [reference/QueryCache.md](../src/content/docs/zh/reference/QueryCache.md) | 已核对，保留现有译文 |
| [reference/QueryClient.md](../src/content/docs/zh/reference/QueryClient.md) | 已核对并修订 |
| [reference/QueryObserver.md](../src/content/docs/zh/reference/QueryObserver.md) | 已核对，保留现有译文 |
| [reference/environmentManager.md](../src/content/docs/zh/reference/environmentManager.md) | 已核对，保留现有译文 |
| [reference/focusManager.md](../src/content/docs/zh/reference/focusManager.md) | 已核对，保留现有译文 |
| [reference/notifyManager.md](../src/content/docs/zh/reference/notifyManager.md) | 已核对，保留现有译文 |
| [reference/onlineManager.md](../src/content/docs/zh/reference/onlineManager.md) | 已核对，保留现有译文 |
| [reference/streamedQuery.md](../src/content/docs/zh/reference/streamedQuery.md) | 已核对，保留现有译文 |
| [reference/timeoutManager.md](../src/content/docs/zh/reference/timeoutManager.md) | 已核对并修订 |
