---
id: graphql
title: GraphQL
---

<!--
translation-source-path: framework/react/graphql.md
translation-source-ref: v5.90.3
translation-source-hash: 305999891fd5ef4d823fcc8ecb7f3f04e913e8cc09c0fddf2e398f21b1b1b3db
translation-status: translated
-->


由于 React Query 的获取机制是基于 Promise 构建且与实现无关的，所以你几乎可以把 React Query 与任何异步数据获取客户端一起使用，包括 GraphQL！

> 请记住，React Query 不支持规范化缓存。虽然绝大多数用户实际上并不需要规范化缓存，或它带来的收益没有想象中那么大，但在极少数场景下它可能确实有必要，所以请先与我们确认这是否真的是你的需求。

[//]: # 'Codegen'

## 类型安全与代码生成

React Query 与 `graphql-request^5`、[GraphQL Code Generator](https://graphql-code-generator.com/) 结合使用时，可以提供完整类型化的 GraphQL 操作：

```tsx
import request from 'graphql-request'
import { useQuery } from '@tanstack/react-query'

import { graphql } from './gql/gql'

const allFilmsWithVariablesQueryDocument = graphql(/* GraphQL */ `
  query allFilmsWithVariablesQuery($first: Int!) {
    allFilms(first: $first) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`)

function App() {
  // `data` is fully typed!
  const { data } = useQuery({
    queryKey: ['films'],
    queryFn: async () =>
      request(
        'https://swapi-graphql.netlify.app/.netlify/functions/index',
        allFilmsWithVariablesQueryDocument,
        // variables are type-checked too!
        { first: 10 },
      ),
  })
  // ...
}
```

_你可以在仓库中找到[完整示例](https://github.com/dotansimha/graphql-code-generator/tree/7c25c4eeb77f88677fd79da557b7b5326e3f3950/examples/front-end/react/tanstack-react-query)_

可从 [GraphQL Code Generator 文档中的专用指南](https://www.the-guild.dev/graphql/codegen/docs/guides/react-vue)开始。

[//]: # 'Codegen'
