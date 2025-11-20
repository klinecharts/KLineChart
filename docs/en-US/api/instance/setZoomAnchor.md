---
outline: deep
---

# setZoomAnchor(anchor)
`setZoomAnchor` set zoom anchor point for main and xAxis panes.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setZoomAnchor.md-->

### Parameters {#parameters}
- `anchor: ZoomAnchor` zoom anchor point type for main and xAxis pane, supports `cursor` ， `last_bar` 和 `{ main: 'cursor' | 'last_bar', xAxis: 'cursor' | 'last_bar' }`.

### Returns {#returns}
`setZoomAnchor` returns `undefined` .

## Usage {#usage}
<script setup>
import SetZoomAnchor from '../../../@views/api/samples/setZoomAnchor/index.vue'
</script>

### Basic usage {#basic}
<SetZoomAnchor/>