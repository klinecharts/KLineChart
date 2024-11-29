---
outline: deep
---

# zoomAtTimestamp(scale, timestamp, animationDuration?)
`zoomAtTimestamp` 在指定时间戳位置缩放。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/zoomAtTimestamp.md -->

### 参数 {#parameters}
- `scale` 缩放比例
- `timestamp` 时间戳
- `animationDuration` 动画持续时间，如果小于等于0，则无动画。

### 返回值 {#returns}
`zoomAtTimestamp` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import ZoomAtTimestamp from '../../@views/api/samples/zoomAtTimestamp/index.vue'
</script>

### 基本用法 {#basic}
<ZoomAtTimestamp/>