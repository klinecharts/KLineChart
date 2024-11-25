---
outline: deep
---

# registerXAxis(xAxis)
`registerXAxis` 用于扩展 x 轴。

## 参考 {#reference}
<!--@include: @/@views/api/references/chart/registerXAxis.md-->

### 参数
- `xAxis` x轴配置。
  - `name` 名称，用于创建或者修改的唯一标识。
  - `scrollZoomEnabled` 是否在轴上可以滚动缩放。
  - `createTicks` 创建分割信息回调方法。

### 返回值
`registerXAxis` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import RegisterXAxisBasic from '../../@views/api/samples/registerXAxis/index.vue'
</script>

### 基本使用 {#basic}
<RegisterXAxisBasic/>