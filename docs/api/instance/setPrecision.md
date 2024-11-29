---
outline: deep
---

# setPrecision(precision)
`setPrecision` 设置图表价格数量精度。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setPrecision.md-->

### 参数 {#parameters}
- `precision` 精度。
  - `price` 价格精度。
  - `volume` 数量精度。 

### 返回值 {#returns}
`setPrecision` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetPrecision from '../../@views/api/samples/setPrecision/index.vue'
</script>

### 基本使用 {#basic}
<SetPrecision/>