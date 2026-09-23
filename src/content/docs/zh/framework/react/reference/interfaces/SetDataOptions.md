---
id: SetDataOptions
title: SetDataOptions
---


定义于： [packages/query-core/src/types.ts:1655](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1655)

用于向缓存写入数据的选项，例如通过 `queryClient.setQueryData()`。`updatedAt` 会覆盖记录该数据的时间戳，数据是否 stale 以此为基准；省略时使用当前时间。

## 属性

| 属性 | 类型 |
| ------ | ------ |
| <a id="updatedat"></a> `updatedAt?` | `number` |
