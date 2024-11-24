---
outline: deep
---

# registerYAxis(yAxis)
`registerYAxis` 用于扩展 y 轴。

## 参考 {#reference}
<!--@include: @/@views/api/chart/registerYAxis/reference.md-->

### 参数
- `yAxis` y轴配置。
  - `name` 名称，用于创建或者修改的唯一标识。
  - `reverse` 是否是反置。
  - `inside` 是否在内部。
  - `position` 位置，支持 `left` 和 `right` 。
  - `scrollZoomEnabled` 是否在轴上可以滚动缩放。
  - `gap` 间隙。
    - `top` 顶部间隙，当值在 0 和 1 之间时，将作为百分比。
    - `bottom` 底部间隙，当值在 0 和 1 之间时，将作为百分比。
  - `valueToRealValue` 值转换成真实值回调方法。
  - `realValueToDisplayValue` 真实值转换成显示值回调方法。
  - `displayValueToRealValue` 显示值转换成真实值回调方法。
  - `realValueToValue` 真实值转换成值回调方法。
  - `displayValueToText` 显示值转换成显示文字回调方法。
  - `minSpan` 最小跨度计算回调方法。
  - `createRange` 创建轴上取值范围回调方法。
  - `createTicks` 创建分割信息回调方法。

### 返回值
`registerYAxis` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import RegisterYAxisBasic from '../../@views/api/samples/registerYAxis/index.vue'
</script>

### 基本使用 {#basic}
<RegisterYAxisBasic/>