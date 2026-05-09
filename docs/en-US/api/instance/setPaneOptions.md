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

### Returns {#returns}
`setPaneOptions` returns `undefined` .

## Usage {#usage}
<script setup>
import SetPaneOptionsBasic from '../../../@views/api/samples/setPaneOptions-basic/index.vue'
import SetPaneOptionsDragEnabled from '../../../@views/api/samples/setPaneOptions-dragEnabled/index.vue'
import SetPaneOptionsState from '../../../@views/api/samples/setPaneOptions-state/index.vue'
</script>

### Basic usage {#basic}
<SetPaneOptionsBasic/>

### Height cannot be adjusted {#dragEnabled}
<SetPaneOptionsDragEnabled/>

### Minimize the window {#state}
<SetPaneOptionsState/>

