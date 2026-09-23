---
id: RefetchOptions
title: RefetchOptions
---


定义于： [packages/query-core/src/types.ts:763](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L763)

## 继承

- [`ResultOptions`](ResultOptions.md)

## 由以下类型扩展

- [`InvalidateOptions`](InvalidateOptions.md)
- [`ResetOptions`](ResetOptions.md)

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| ------ | ------ | ------ | ------ |
| <a id="cancelrefetch"></a> `cancelRefetch?` | `boolean` | `true` | 设为 `true` 时，发起新请求前会取消当前正在运行的请求。设为 `false` 时，如果已有请求正在运行，则不会重新获取。 |
| <a id="throwonerror"></a> `throwOnError?` | `boolean` | `false` | 设为 `true` 时，只要底层任一查询重新获取任务失败，此方法就会抛出错误。设为 `false` 时，重新获取的失败不会向调用方抛出。 |
