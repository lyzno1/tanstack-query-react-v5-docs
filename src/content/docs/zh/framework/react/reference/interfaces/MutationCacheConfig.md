---
id: MutationCacheConfig
title: MutationCacheConfig
---


定义于： [packages/query-core/src/mutationCache.ts:26](https://github.com/TanStack/query/blob/main/packages/query-core/src/mutationCache.ts#L26)

`MutationCache` 处理的每个 mutation 都会触发这些全局回调，无论由哪个组件或观察者发起。与 `QueryClient` 的 `defaultOptions` 有两点区别：每个 mutation 可以覆盖默认选项，却无法覆盖这些始终会调用的回调；此外，这里的 `onMutate` 不允许返回结果。

若回调返回 Promise，会在 mutation 继续执行前等待它完成。

## 属性

| 属性 | 类型 | 说明 |
| ------ | ------ | ------ |
| <a id="onerror"></a> `onError?` | (`error`: `Error`, `variables`: `unknown`, `onMutateResult`: `unknown`, `mutation`: [`Mutation`](../classes/Mutation.md)\<`unknown`, `unknown`, `unknown`\>, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `unknown` | 缓存中的任一 mutation 出错时调用。 |
| <a id="onmutate"></a> `onMutate?` | (`variables`: `unknown`, `mutation`: [`Mutation`](../classes/Mutation.md)\<`unknown`, `unknown`, `unknown`\>, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `unknown` | 缓存中的任一 mutation 执行前调用。 |
| <a id="onsettled"></a> `onSettled?` | (`data`: `unknown`, `error`: `Error` \| `null`, `variables`: `unknown`, `onMutateResult`: `unknown`, `mutation`: [`Mutation`](../classes/Mutation.md)\<`unknown`, `unknown`, `unknown`\>, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `unknown` | 缓存中的任一 mutation 结束时调用，不论成功或出错。 |
| <a id="onsuccess"></a> `onSuccess?` | (`data`: `unknown`, `variables`: `unknown`, `onMutateResult`: `unknown`, `mutation`: [`Mutation`](../classes/Mutation.md)\<`unknown`, `unknown`, `unknown`\>, `context`: [`MutationFunctionContext`](../type-aliases/MutationFunctionContext.md)) => `unknown` | 缓存中的任一 mutation 成功时调用。 |
