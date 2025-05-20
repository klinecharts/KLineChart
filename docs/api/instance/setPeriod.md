---
outline: deep
---

# setPeriod(period)
`setPeriod` 设置周期。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setPeriod.md-->

### 参数 {#parameters}
- `period` 时间周期。
  - `type` 类型，支持 `second` ， `minute` ， `hour` ， `day` ， `week` ， `month` 和 `year` 。
  - `span` 时间跨度。

### 返回值 {#returns}
`setPeriod` 返回 `undefined` 。


## 用法 {#usage}
<script setup>
import SetPeriod from '../../@views/api/samples/setPeriod/index.vue'
</script>

### 基本使用 {#basic}
<SetPeriod/>