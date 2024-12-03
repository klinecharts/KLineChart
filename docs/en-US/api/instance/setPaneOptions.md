---
outline: deep
---

# setPaneOptions(options)
`setPaneOptions` set the pane configuration.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/setPaneOptions.md -->

### Parameters {#parameters}
- `options` Pane configuration.
  - `id` Pane id.
  - `height` Height.
  - `minHeight` Min height.
  - `dragEnabled` Whether the height can be adjusted by dragging.
  - `order` Order.
  - `state` State, supports `normal` , `maximize` and `minimize` .
  - `axis` Axis configuration.
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
`setPaneOptions` returns `undefined` .

## Usage {#usage}
<script setup>
import SetPaneOptionsBasic from '../../../@views/api/samples/setPaneOptions-basic/index.vue'
import SetPaneOptionsDragEnabled from '../../../@views/api/samples/setPaneOptions-dragEnabled/index.vue'
import SetPaneOptionsState from '../../../@views/api/samples/setPaneOptions-state/index.vue'
import SetPaneOptionsAxisBasic from '../../../@views/api/samples/setPaneOptions-axis-basic/index.vue'
import SetPaneOptionsAxisExtension from '../../../@views/api/samples/setPaneOptions-axis-extension/index.vue'
</script>

### Basic usage {#basic}
<SetPaneOptionsBasic/>

### Height cannot be adjusted {#dragEnabled}
<SetPaneOptionsDragEnabled/>

### Minimize the window {#state}
<SetPaneOptionsState/>

### Set basic properties of the axis {#axis}
<SetPaneOptionsAxisBasic/>

### Simple custom axis
<SetPaneOptionsAxisExtension/>


