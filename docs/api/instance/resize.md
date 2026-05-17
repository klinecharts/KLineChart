---
outline: deep
---

<script setup>
import Resize from '../../@views/api/samples/Resize/index.vue'
import Tip from '../../@components/Tip.vue'
</script>

# resize()
`resize` 调整图表尺寸。

<Tip type="warn" title="注意" :tip="['图表默认会监听容器尺寸变化并自动调整布局。此方法会重新计算整个图表各个模块的大小，通常只需要在特殊场景下手动调用，频繁调用可能会影响到性能。']"/>

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/resize.md -->

### 参数 {#parameters}
`resize` 不接收任何参数。

### 返回值 {#returns}
`resize` 返回 `undefined` 。

## 用法 {#usage}

### 基本用法 {#basic}
<Resize/>
