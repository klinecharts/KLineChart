---
outline: deep
---

# overrideXAxis(options)
`overrideXAxis` 设置 x 轴配置。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/overrideXAxis.md -->

### 参数 {#parameters}
- `options` x 轴配置项。
  - `name` 坐标轴名称。
  - `scrollZoomEnabled` 是否允许滚动缩放。
  - `createTicks` 创建分割信息回调方法。

### 返回值 {#returns}
`overrideXAxis` 返回 `undefined`。

## 用法 {#usage}
<script setup>
import OverrideXAxis from '../../@views/api/samples/overrideXAxis/index.vue'
</script>

### 基本使用 {#basic}
<OverrideXAxis/>
