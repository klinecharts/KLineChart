---
outline: deep
---

# setSymbol(symbol)
`setSymbol` 设置交易对。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setSymbol.md-->

### 参数 {#parameters}
- `symbol` 交易对信息。
  - `ticker` 交易对唯一标识。
  - `pricePrecision` 价格精度。
  - `volumePrecision` 数量精度。

### 返回值 {#returns}
`setSymbol` 返回 `undefined` 。


## 用法 {#usage}
<script setup>
import SetSymbol from '../../@views/api/samples/setSymbol/index.vue'
</script>

### 基本使用 {#basic}
<SetSymbol/>