---
id: CancelOptions
title: CancelOptions
---


定义于： [packages/query-core/src/types.ts:1645](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1645)

用于取消正在进行的获取的选项，例如调用 `query.cancel()`。取消后的获取会以 [CancelledError](../classes/CancelledError.md) 拒绝；这些选项会附在该错误上。

## 属性

| 属性 | 类型 |
| ------ | ------ |
| <a id="revert"></a> `revert?` | `boolean` |
| <a id="silent"></a> `silent?` | `boolean` |
