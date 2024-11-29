---
outline: deep
---

# unsubscribeAction(type, cb?)
`unsubscribeAction` Unsubscribe from chart actions.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/unsubscribeAction.md -->

### Parameters {#parameters}
- `type` Type, supports `onZoom`, `onScroll`, `onVisibleRangeChange`, `onTooltipIconClick`, `onCrosshairChange`, `onCandleBarClick` and `onPaneDrag` .
- `cb` The callback method when subscribing. By default, all subscriptions of the current type are canceled.

### Returns {#returns}
`unsubscribeAction` returns `undefined` .

## Usage {#usage}
<script setup>
import UnsubscribeAction from '../../../@views/api/samples/unsubscribeAction/index.vue'
</script>

### Basic usage {#basic}
<UnsubscribeAction/>