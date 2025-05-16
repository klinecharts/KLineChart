---
outline: deep
---

# setDataLoader(dataLoader)
`setDataLoader` 设置数据加载器。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setDataLoader.md-->

### 参数 {#parameters}
- `dataLoader` 数据加载器。
  - `getBars` 获取数据，会在设置交易对信息，设置周期和图表左右拖动到边界时触发。
  - `subscribeBar` 订阅实时的数据，会在设置交易对信息，设置周期，`getBars` 完成之后触发。
  - `unsubscribeBar` 取消订阅实时的数据，会在设置交易对信息，设置周期后触发。

### 返回值 {#returns}
`setDataLoader` 返回 `undefined` 。


## 用法 {#usage}
<script setup>
import SetDataLoader from '../../@views/api/samples/setDataLoader/index.vue'
</script>

### 基本使用 {#basic}
<SetDataLoader/>