---
outline: deep
---

# scrollToDataIndex(dataIndex, animationDuration?)
`scrollToDataIndex` 滚动图表最右侧到指定数据索引位置。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/scrollToDataIndex.md -->

### 参数 {#parameters}
- `dataIndex` 数据索引。
- `animationDuration` 动画持续时间，如果小于等于0，则无动画。

### 返回值 {#returns}
`scrollToDataIndex` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import ScrollToDataIndex from '../../@views/api/samples/scrollToDataIndex/index.vue'
</script>

### 基本用法 {#basic}
<ScrollToDataIndex/>