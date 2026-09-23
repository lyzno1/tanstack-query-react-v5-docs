---
id: ResultOptions
title: ResultOptions
---


定义于： [packages/query-core/src/types.ts:753](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L753)

## 由以下类型扩展

- [`RefetchOptions`](RefetchOptions.md)
- [`FetchNextPageOptions`](FetchNextPageOptions.md)
- [`FetchPreviousPageOptions`](FetchPreviousPageOptions.md)

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| ------ | ------ | ------ | ------ |
| <a id="throwonerror"></a> `throwOnError?` | `boolean` | `false` | 设为 `true` 时，只要底层任一查询重新获取任务失败，此方法就会抛出错误。设为 `false` 时，重新获取的失败不会向调用方抛出。 |
