---
outline: deep
---

# registerXAxis(xAxis)
`registerXAxis` used to custom x-axis.

## Reference {#reference}
<!--@include: @/@views/api/references/chart/registerXAxis.md-->

### Parameters
- `xAxis` X-axis configuration.
  - `name` Name, a unique identifier used for creation or modification.
  - `scrollZoomEnabled` Whether scrolling and zooming are possible on the axis.
  - `createTicks` Create ticks information callback method.

### Returns
`registerXAxis` returns `undefined` .

## Usage {#usage}
<script setup>
import RegisterXAxisBasic from '../../../@views/api/samples/registerXAxis/index.vue'
</script>

### Basic usage {#basic}
<RegisterXAxisBasic/>