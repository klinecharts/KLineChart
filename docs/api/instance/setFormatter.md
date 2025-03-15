---
outline: deep
---

# setFormatter(formatter)
`setFormatter` 设置图表的一些内置的格式化api。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setFormatter.md-->

### 参数 {#parameters}
- `formatter` 格式化的一些api。
  - `formatDate` 格式化日期。
  - `formatBigNumber` 格式化大的数字，如1000转换成1k，1000000转换为1M等。

### 返回值 {#returns}
`setFormatter` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetFormatterFormatDate from '../../@views/api/samples/setFormatter-formatDate/index.vue'
import SetFormatterFormatBigNumber from '../../@views/api/samples/setFormatter-formatBigNumber/index.vue'
</script>

### 格式化时间 {#formatDate}
<SetFormatterFormatDate/>

### 格式化大数字 {#formatBigNumber}
<SetFormatterFormatBigNumber/>