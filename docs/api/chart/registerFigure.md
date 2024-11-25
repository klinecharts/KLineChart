---
outline: deep
---

# registerFigure(figure)
`registerFigure` 用于自定义基础图形。

## 参考 {#reference}
<!--@include: @/@views/api/references/chart/registerFigure.md-->

### 参数
- `figure` 基础图形配置。
  - `name` 名称，唯一标识。
  - `draw` 绘制方法。
  - `checkEventOn` 检查事件是否在图形上。


### 返回值
`registerFigure` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import CustomFigureCustomIndicator from '../../@views/api/samples/custom-figure-custom-indicator/index.vue'
import CustomFigureCustomOverlay from '../../@views/api/samples/custom-figure-custom-overlay/index.vue'
</script>

### 用于自定义指标中 {#usage-custom-indicator}
<CustomFigureCustomIndicator />

### 用于自定义覆盖物中 {#usage-custom-overlay}
<CustomFigureCustomOverlay />