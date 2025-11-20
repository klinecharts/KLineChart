---
outline: deep
---

# setZoomAnchor(anchor)
`setZoomAnchor` 设置主窗格和 x 轴窗格的缩放锚点。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setZoomAnchor.md-->

### 参数 {#parameters}
- `anchor`: 主窗格和 x 轴窗格的缩放锚点类型, 支持 `cursor` ， `last_bar` 和 `{ main: 'cursor' | 'last_bar', xAxis: 'cursor' | 'last_bar' }`。

### 返回值 {#returns}
`setZoomAnchor` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetZoomAnchor from '../../@views/api/samples/setZoomAnchor/index.vue'
</script>

### 基本用法 {#basic}
<SetZoomAnchor/>