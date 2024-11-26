---
outline: deep
---

# setCustomApi(customApi)
`setCustomApi` 设置图表的一些内置api。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setCustomApi.md-->

### 参数
- `customApi` 自定义一些api。
  - `formatDate` 格式化日期。
  - `formatBigNumber` 格式化大的数字，如1000转换成1k，1000000转换为1M等。

### 返回值
`setCustomApi` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetCustomApiFormatDate from '../../@views/api/samples/setCustomApi-formatDate/index.vue'
import SetCustomApiFormatBigNumber from '../../@views/api/samples/setCustomApi-formatBigNumber/index.vue'
</script>

### 格式化时间 {#formatDate}
<SetCustomApiFormatDate/>

### 格式化大数字 {#formatBigNumber}
<SetCustomApiFormatBigNumber/>