---
outline: deep
---

# getSymbol()
`getSymbol` 获取当前交易对。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/getSymbol.md-->

### 参数 {#parameters}
`getSymbol` 不接收任何参数。

### 返回值 {#returns}
`getSymbol` 返回一个包含交易对信息的 `SymbolInfo` 对象或者 `null` 。


## 用法 {#usage}
<script setup>
import GetSymbol from '../../@views/api/samples/getSymbol/index.vue'
</script>

### 基本使用 {#basic}
<GetSymbol/>