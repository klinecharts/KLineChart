---
outline: deep
---

# zoomAtDataIndex(scale, dataIndex, animationDuration?)
`zoomAtDataIndex` 在指定数据索引位置缩放。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/zoomAtDataIndex.md -->

### 参数
- `scale` 缩放比例
- `dataIndex` 数据索引。
- `animationDuration` 动画持续时间，如果小于等于0，则无动画。

### 返回值
`zoomAtCoordinate` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import ZoomAtDataIndex from '../../../@views/api/samples/zoomAtDataIndex/index.vue'
</script>

### 基本用法 {#basic}
<ZoomAtDataIndex/>