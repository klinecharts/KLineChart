---
outline: deep
---

# resize()
`resize` 调整图表尺寸。

::: warning 注意
总是会填充容器大小，此方法会重新计算整个图表各个模块的大小，频繁调用可能会影响到性能，调用请谨慎。
:::

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/resize.md -->

### 参数
`resize` 不接收任何参数。

### 返回值
`resize` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import Resize from '../../../@views/api/samples/Resize/index.vue'
</script>

### 基本用法 {#basic}
<Resize/>