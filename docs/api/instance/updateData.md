---
outline: deep
---

# updateData(data)
`updateData` 更新数据。

::: tip 提示
该方法只会匹配当前最后一条数据的时间戳，相同则覆盖，时间戳大于则追加。
:::

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/updateData.md -->

### 参数 {#parameters}
- `data` K 线数据，数据格式参照 [数据](/guide/data-source)。

### 返回值 {#returns}
`updateData` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import UpdateData from '../../@views/api/samples/updateData/index.vue'
</script>

### 基本用法 {#basic}
<UpdateData/>