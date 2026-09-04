---
id: UseQueryResult
title: UseQueryResult
---

<!--
translation-source-path: framework/react/reference/type-aliases/UseQueryResult.md
translation-source-ref: main
translation-source-hash: ecc83fd6efacbf8b5e170e07aa8c3502390a16269868ed168e4c88d88f590f20
translation-status: translated
-->


```ts
type UseQueryResult<TData, TError> = UseBaseQueryResult<TData, TError>;
```

定义于：[react-query/src/types.ts:325](https://github.com/TanStack/query/blob/main/packages/react-query/src/types.ts#L325)

`useQuery` 的结果。与 [UseBaseQueryResult](UseBaseQueryResult.md) 相同。

## 类型参数

### TData

`TData` = `unknown`

`select` 执行后 `data` 的最终类型。

### TError

`TError` = `DefaultError`

`queryFn` 可能抛出的错误类型。
