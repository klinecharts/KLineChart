---
outline: deep
---

# subscribeAction(type, cb)
`subscribeAction` 订阅图表动作。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/subscribeAction.md -->

### 参数 {#parameters}
- `type` 类型，支持 `onZoom` ， `onScroll` ， `onVisibleRangeChange` ， `onTooltipIconClick` ， `onCrosshairChange` ， `onCandleBarClick` 和 `onPaneDrag` 。
- `cb` 回调方法。

### 返回值 {#returns}
`executeAction` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SubscribeAction from '../../@views/api/samples/subscribeAction/index.vue'
</script>

### 基本用法 {#basic}
<SubscribeAction/>