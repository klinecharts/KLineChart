---
outline: deep
---

# setPaneOptions(options)
`setPaneOptions` set the pane configuration.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/setPaneOptions.md -->

### Parameters
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

### Returns
`setPaneOptions` returns `undefined` .

## Usage {#usage}
<script setup>
import SetPaneOptionsBasic from '../../../@views/api/samples/setPaneOptions-basic/index.vue'
import SetPaneOptionsDragEnabled from '../../../@views/api/samples/setPaneOptions-dragEnabled/index.vue'
import SetPaneOptionsState from '../../../@views/api/samples/setPaneOptions-state/index.vue'
import SetPaneOptionsAxis from '../../../@views/api/samples/setPaneOptions-axis/index.vue'
</script>

### Basic usage {#basic}
<SetPaneOptionsBasic/>

### 不可调整高度
<SetPaneOptionsDragEnabled/>

### 最小化
<SetPaneOptionsState/>

### 坐标轴
<SetPaneOptionsAxis/>

