---
aside: false
---

# registerFigure(figure)
`registerFigure` 用于自定义基础图形。

<!--@include: @/@views/api/chart/registerFigure/api.md-->

- [参考](#reference)
- [用法](#usage)
  - [将自定义基础图形用于自定义指标中](#usage-custom-indicator)
  - [将自定义基础图形用于自定义覆盖物中](#usage-custom-overlay)

## 参考 {#reference}
<!--@include: @/@views/api/chart/registerFigure/reference.md-->

### 参数
- `figure` 基础图形配置。
  - `name` 名字，唯一标识。
  - `draw` 绘制方法。
  - `checkEventOn` 检查事件是否在图形上。


### 返回值
`registerFigure` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import RegisterFigureUsageCustomIndicator from '../../@views/api/samples/registerFigure-usage-custom-indicator/index.vue'
import RegisterFigureUsageCustomOverlay from '../../@views/api/samples/registerFigure-usage-custom-overlay/index.vue'
</script>

### 将自定义基础图形用于自定义指标中 {#usage-custom-indicator}
<RegisterFigureUsageCustomIndicator />

### 将自定义基础图形用于自定义覆盖物中 {#usage-custom-overlay}
<RegisterFigureUsageCustomOverlay />