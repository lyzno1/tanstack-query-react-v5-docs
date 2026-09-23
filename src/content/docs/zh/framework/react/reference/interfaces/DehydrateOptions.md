---
id: DehydrateOptions
title: DehydrateOptions
---


定义于： [packages/query-core/src/hydration.ts:42](https://github.com/TanStack/query/blob/main/packages/query-core/src/hydration.ts#L42)

`dehydrate` 的选项，用于控制哪些查询和 mutation 会包含在生成的 `DehydratedState` 中，以及数据和错误在序列化之前如何转换（例如嵌入服务端渲染的标记前）。

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="serializedata"></a> `serializeData?` | `TransformerFn` | 对查询执行 dehydrate 前转换其 `data`，适用于无法直接序列化为 JSON 的数据。 |
| <a id="shoulddehydratemutation"></a> `shouldDehydrateMutation?` | (`mutation`: [`Mutation`](../classes/Mutation.md)) => `boolean` | 判断是否对给定 `Mutation` 执行 dehydrate 的谓词；默认为 `defaultShouldDehydrateMutation`。 |
| <a id="shoulddehydratequery"></a> `shouldDehydrateQuery?` | (`query`: [`Query`](../classes/Query.md)) => `boolean` | 判断是否对给定 `Query` 执行 dehydrate 的谓词；默认为 `defaultShouldDehydrateQuery`。 |
| <a id="shouldredacterrors"></a> `shouldRedactErrors?` | (`error`: `unknown`) => `boolean` | 判断是否在 dehydration 前遮蔽查询错误的谓词。默认会将错误替换为通用的 `Error('redacted')`；如果提供此函数且它对给定错误返回 `false`，则保留原始错误。 |
