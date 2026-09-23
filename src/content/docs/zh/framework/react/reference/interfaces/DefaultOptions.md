---
id: DefaultOptions
title: DefaultOptions
---


定义于： [packages/query-core/src/types.ts:1627](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1627)

## 类型参数

### TError

`TError` = [`DefaultError`](../type-aliases/DefaultError.md)

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="dehydrate"></a> `dehydrate?` | [`DehydrateOptions`](DehydrateOptions.md) | 对客户端缓存执行 dehydrate 时使用的默认选项；参阅 [DehydrateOptions](DehydrateOptions.md)。 |
| <a id="hydrate"></a> `hydrate?` | `object` | 对查询执行 hydrate 时使用的默认选项；参阅 [HydrateOptions](HydrateOptions.md)。 |
| `hydrate.deserializeData?` | `TransformerFn` | 从 dehydrate 状态读取查询的 `data` 后执行转换，以反转 `serializeData` 所做的处理。 |
| `hydrate.mutations?` | [`MutationOptions`](MutationOptions.md)\<`unknown`, `Error`, `unknown`, `unknown`\> | 合并到从 dehydrate 状态恢复的每个 mutation 的默认选项。 |
| `hydrate.queries?` | [`QueryOptions`](QueryOptions.md)\<`unknown`, `Error`, `unknown`, readonly `unknown`[], `never`\> | 合并到从 dehydrate 状态恢复的每个查询的默认选项。 |
| <a id="mutations"></a> `mutations?` | [`MutationObserverOptions`](MutationObserverOptions.md)\<`unknown`, `TError`, `unknown`, `unknown`\> | 应用于每个 mutation 的默认选项，除非单独覆盖。 |
| <a id="queries"></a> `queries?` | [`OmitKeyof`](../type-aliases/OmitKeyof.md)\<[`QueryObserverOptions`](QueryObserverOptions.md)\<`unknown`, `TError`, `unknown`, `unknown`, readonly `unknown`[], `never`\>, `"queryKey"` \| `"suspense"`, `"strictly"`\> | 应用于每个查询的默认选项，除非单独覆盖。 |
