---
outline: deep
---

# subscribeAction(type, cb)
`subscribeAction` subscribe to chart actions.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/subscribeAction.md -->

### Parameters
- `type` Type, supports `onZoom`, `onScroll`, `onVisibleRangeChange`, `onTooltipIconClick`, `onCrosshairChange`, `onCandleBarClick` and `onPaneDrag` .
- `cb` Callback.

### Returns
`executeAction` returns `undefined` .

## Usage {#usage}
<script setup>
import SubscribeAction from '../../../@views/api/samples/subscribeAction/index.vue'
</script>

### Basic usage {#basic}
<SubscribeAction/>