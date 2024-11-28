---
outline: deep
---

# unsubscribeAction(type, cb?)
`unsubscribeAction` 取消订阅图表动作。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/unsubscribeAction.md -->

### 参数
- `type` 类型，支持 `onZoom` ， `onScroll` ， `onVisibleRangeChange` ， `onTooltipIconClick` ， `onCrosshairChange` ， `onCandleBarClick` 和 `onPaneDrag` 。
- `cb` 订阅时的回调方法，缺省则取消当前类型所有。

### 返回值
`unsubscribeAction` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import UnsubscribeAction from '../../@views/api/samples/unsubscribeAction/index.vue'
</script>

### 基本用法 {#basic}
<UnsubscribeAction/>