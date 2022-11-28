## Level 2

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## Import Code Snippets

::: info Usage:
`<<< @/filepath{highlightLines}`
:::

<<< @/snippets/snippets.js#bar{2 javascript}

<!-- <<< @/../deploy.sh{1,4-10 sh} -->

## Level 2 语法相关

- 算术 {{ 1 + 2 }}

- 循环 <span v-for="i in 3">{{ i }}</span>

- 组件引用
<script setup>
import { useData } from 'vitepress'
import LiveSource from '@/components/LiveSource.vue'
const page = useData()
// console.log(page)
</script>

This is a .md using a custom component

<LiveSource />
<!-- <pre>{{ page }}</pre> -->

## Level 2 文档相关

[ES6 相关](./js%E9%AB%98%E7%BA%A7.md)

[TypeScript](./TypeScript.md)

[Git 相关](./Tool-Document.md)

[Linux](./Linux.md)
