---
outline: deep
---

# zoomAtCoordinate(scale, coordinate?, animationDuration?)
`zoomAtCoordinate` 在指定坐标点缩放。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/zoomAtCoordinate.md -->

### 参数
- `scale` 缩放比例
- `coordinate` 坐标点。
  - `x` 横坐标。
  - `y` 纵坐标。
- `animationDuration` 动画持续时间，如果小于等于0，则无动画。

### 返回值
`zoomAtCoordinate` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import ZoomAtCoordinate from '../../@views/api/samples/zoomAtCoordinate/index.vue'
</script>

### 基本用法 {#basic}
<ZoomAtCoordinate/>