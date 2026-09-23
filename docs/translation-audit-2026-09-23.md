# 中文文档同步与术语审查记录（2026-09-23）

同步基准：TanStack/query `main`，提交 `32ca5b50d4f646b489bc57100767990ef55718c7`。同步范围由 139 篇扩大至 280 篇 Markdown 文档；新增 React API 参考的类、接口、函数、类型别名与变量，移除上游已删除的旧参考文件。英文页面由 `pnpm sync:docs` 生成，没有手动修改。

## 中文审查

- 为新增 API 页面补齐中文说明，保留类型签名、参数、默认值、返回类型、锚点及代码示例；旧译文同步上游改动，尤其是 `QueryClient` 的 `query` / `infiniteQuery` 方法、`initialData` 与 `select` 的类型边界，以及 `QueriesOptions` 对非元组数组的推断规则。
- 将旧参考路径调整为新版 `framework/react/reference/classes`、`interfaces`、`functions` 等目录；同步服务端渲染示例、异步持久化回调和窗口焦点问题排查。
- 全仓检查专业术语：TanStack Query 的概念保留 `mutation`，调用方法保留 `mutate`；保留 `hydration`、`dehydration`、`hydrate`、`dehydrate` 及相关 API 原名。“破坏性变更”“类型变更”等普通中文表达仍依原意使用。将该约定写入翻译术语表，并修复现存译文中的误译与生硬拼接。
- 逐项更新已审阅页面的源文档哈希。同步状态：280 篇已覆盖，缺失 0、过期 0、孤儿文件 0。

## 校验

`pnpm check`、`pnpm lint`、`pnpm i18n:check`、`pnpm test:maintenance`、`pnpm build`、`pnpm links:check` 和 `pnpm seo:check`。自动检查确保覆盖、结构和链接有效，语义仍需以中英文内容审阅为准。
