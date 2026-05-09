---
outline: deep
---

# overrideYAxis(options)
`overrideYAxis` set the y-axis configuration.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/overrideYAxis.md -->

### Parameters {#parameters}
- `options` Y-axis configuration.
  - `paneId` Pane id.
  - `id` Y-axis id.
  - `name` The name of the axis.
  - `reverse` Whether to reverse.
  - `inside` Whether it is inside.
  - `position` Position, supports `left` and `right`.
  - `scrollZoomEnabled` Whether to allow scrolling and zooming.
  - `gap` Top and bottom margin configuration.
    - `top` Top margin.
    - `bottom` Bottom margin.
  - `createRange` Create an axis value range callback method.
  - `createTicks` Create ticks information callback method.

### Returns {#returns}
`overrideYAxis` returns `undefined` .

## Usage {#usage}
<script setup>
import OverrideYAxisBasic from '../../../@views/api/samples/setPaneOptions-axis-basic/index.vue'
import OverrideYAxisExtension from '../../../@views/api/samples/setPaneOptions-axis-extension/index.vue'
</script>

### Basic attrs {#basic}
<OverrideYAxisBasic/>

### Custom ticks {#extension}
<OverrideYAxisExtension/>
