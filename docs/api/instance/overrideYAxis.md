---
outline: deep
---

# overrideYAxis(options)
`overrideYAxis` 设置 y 轴配置。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/overrideYAxis.md -->

### 参数 {#parameters}
- `options` y 轴配置项。
  - `paneId` 窗口 id 。
  - `id` y 轴 id 。
  - `name` 坐标轴名称。
  - `reverse` 是否反向。
  - `inside` 是否在内部。
  - `needWidget` 是否需要创建轴组件。
  - `position` 位置，支持 `left` 和 `right` 。
  - `scrollZoomEnabled` 是否允许在 Y 轴上滚动和缩放。启用后，用户可以拖动滚动轴或使用鼠标滚轮缩放。
  - `gap` 上下边距配置。
    - `top` 上边距。
    - `bottom` 下边距。
  - `createRange` 创建轴上取值范围回调方法。
  - `createTicks` 创建分割信息回调方法。

### 返回值 {#returns}
`overrideYAxis` 返回 `undefined`。

## 用法 {#usage}
<script setup>
import OverrideYAxisBasic from '../../@views/api/samples/overrideYAxis-basic/index.vue'
import OverrideYAxisExtension from '../../@views/api/samples/overrideYAxis-extension/index.vue'
</script>

### 基础属性 {#basic}
<OverrideYAxisBasic/>

### 自定义分割信息 {#extension}
<OverrideYAxisExtension/>
