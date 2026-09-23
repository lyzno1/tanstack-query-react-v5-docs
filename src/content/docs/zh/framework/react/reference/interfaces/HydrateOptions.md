---
id: HydrateOptions
title: HydrateOptions
---


定义于： [packages/query-core/src/hydration.ts:61](https://github.com/TanStack/query/blob/main/packages/query-core/src/hydration.ts#L61)

`hydrate` 的选项，用于控制从 `DehydratedState` 恢复的查询和 mutation 所采用的默认选项，以及如何反转 `DehydrateOptions.serializeData` 所做的转换。

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="defaultoptions"></a> `defaultOptions?` | `object` | 应用于从 dehydrate 状态恢复的查询和 mutation 的选项。 |
| `defaultOptions.deserializeData?` | `TransformerFn` | 从 dehydrate 状态读取查询的 `data` 后执行转换，以反转 `serializeData` 所做的处理。 |
| `defaultOptions.mutations?` | [`MutationOptions`](MutationOptions.md)\<`unknown`, `Error`, `unknown`, `unknown`\> | 合并到从 dehydrate 状态恢复的每个 mutation 的默认选项。 |
| `defaultOptions.queries?` | [`QueryOptions`](QueryOptions.md)\<`unknown`, `Error`, `unknown`, readonly `unknown`[], `never`\> | 合并到从 dehydrate 状态恢复的每个查询的默认选项。 |
