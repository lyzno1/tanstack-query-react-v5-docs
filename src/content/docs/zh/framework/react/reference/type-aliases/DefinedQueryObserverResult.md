---
id: DefinedQueryObserverResult
title: DefinedQueryObserverResult
---


```ts
type DefinedQueryObserverResult<TData, TError> = 
  | QueryObserverRefetchErrorResult<TData, TError>
| QueryObserverSuccessResult<TData, TError>;
```

定义于： [packages/query-core/src/types.ts:1049](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L1049)

## 类型参数

### TData

`TData` = `unknown`

### TError

`TError` = [`DefaultError`](DefaultError.md)
