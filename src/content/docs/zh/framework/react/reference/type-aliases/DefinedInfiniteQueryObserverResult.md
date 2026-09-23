---
id: DefinedInfiniteQueryObserverResult
title: DefinedInfiniteQueryObserverResult
---


```ts
type DefinedInfiniteQueryObserverResult<TData, TError> = 
  | InfiniteQueryObserverRefetchErrorResult<TData, TError>
| InfiniteQueryObserverSuccessResult<TData, TError>;
```

定义于： [packages/query-core/src/types.ts:1210](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1210)

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)
