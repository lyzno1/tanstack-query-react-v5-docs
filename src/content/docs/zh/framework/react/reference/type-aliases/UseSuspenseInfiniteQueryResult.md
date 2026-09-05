---
id: UseSuspenseInfiniteQueryResult
title: UseSuspenseInfiniteQueryResult
---

```ts
type UseSuspenseInfiniteQueryResult<TData, TError> = OmitKeyof<DefinedInfiniteQueryObserverResult<TData, TError>, "isPlaceholderData">;
```

定义于：[react-query/src/types.ts:389](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L389)

`useSuspenseInfiniteQuery` 的结果。它与 [DefinedUseInfiniteQueryResult](DefinedUseInfiniteQueryResult.md) 相同，
但移除了 `isPlaceholderData`——Suspense hook 从不会渲染占位数据。

## 类型参数

### TData

`TData` = `unknown`

`select` 执行后 `data` 的最终类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。
