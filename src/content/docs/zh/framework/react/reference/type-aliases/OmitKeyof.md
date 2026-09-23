---
id: OmitKeyof
title: OmitKeyof
---


```ts
type OmitKeyof<TObject, TKey, TStrictly> = Omit<TObject, TKey>;
```

定义于： [packages/query-core/src/types.ts:19](https://github.com/TanStack/query/blob/main/packages/query-core/src/types.ts#L19)

## 类型参数

### TObject

`TObject`

### TKey

`TKey` *extends* `TStrictly` *extends* `"safely"` ? 
  \| keyof `TObject`
  \| `string` & `Record`\<`never`, `never`\>
  \| `number` & `Record`\<`never`, `never`\>
  \| `symbol` & `Record`\<`never`, `never`\> : keyof `TObject`

### TStrictly

`TStrictly` *extends* `"strictly"` \| `"safely"` = `"strictly"`
