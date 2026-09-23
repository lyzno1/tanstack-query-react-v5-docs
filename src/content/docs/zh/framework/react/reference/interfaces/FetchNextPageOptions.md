---
id: FetchNextPageOptions
title: FetchNextPageOptions
---


定义于： [packages/query-core/src/types.ts:797](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L797)

## 继承

- [`ResultOptions`](ResultOptions.md)

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| ------ | ------ | ------ | ------ |
| <a id="cancelrefetch"></a> `cancelRefetch?` | `boolean` | `true` | 设为 `true` 时，重复调用 `fetchNextPage` 每次都会调用 `queryFn`，无论前一次调用是否完成；前面调用的结果会被忽略。设为 `false` 时，在第一次调用完成前，重复调用不会生效。 |
| <a id="throwonerror"></a> `throwOnError?` | `boolean` | `false` | 设为 `true` 时，只要底层任一查询重新获取任务失败，此方法就会抛出错误。设为 `false` 时，重新获取的失败不会向调用方抛出。 |
