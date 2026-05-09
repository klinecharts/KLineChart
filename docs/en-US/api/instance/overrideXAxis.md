---
outline: deep
---

# overrideXAxis(options)
`overrideXAxis` set the x-axis configuration.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/overrideXAxis.md -->

### Parameters {#parameters}
- `options` X-axis configuration.
  - `name` The name of the axis.
  - `scrollZoomEnabled` Whether to allow scrolling and zooming.
  - `createTicks` Create ticks information callback method.

### Returns {#returns}
`overrideXAxis` returns `undefined` .

## Usage {#usage}
<script setup>
import OverrideXAxis from '../../../@views/api/samples/overrideXAxis/index.vue'
</script>

### Basic usage {#basic}
<OverrideXAxis/>
