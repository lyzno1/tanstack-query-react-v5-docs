---
id: Register
title: Register
---


定义于： [packages/query-core/src/types.ts:56](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L56)

通过声明合并扩展此接口，可在整个项目中覆盖 Query 的默认类型。声明的每个字段会替换对应类型的默认值：`defaultError` 对应 [DefaultError](../type-aliases/DefaultError.md)，`queryKey` 对应 [QueryKey](../type-aliases/QueryKey.md)，`mutationKey` 对应 [MutationKey](../type-aliases/MutationKey.md)，`queryMeta` 对应 [QueryMeta](../type-aliases/QueryMeta.md)，`mutationMeta` 对应 [MutationMeta](../type-aliases/MutationMeta.md)。不声明的字段保留默认值。请扩展实际安装的适配器模块，如 `@tanstack/react-query`、`@tanstack/vue-query`、`@tanstack/solid-query`、`@tanstack/svelte-query`、`@tanstack/preact-query`、`@tanstack/angular-query-experimental` 或 `@tanstack/lit-query`。也可扩展 `@tanstack/query-core`，一次覆盖所有适配器。

## 示例

```ts
// Use the module you installed — here, the React adapter.
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError
  }
}
```
