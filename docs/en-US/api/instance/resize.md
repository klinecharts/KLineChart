---
outline: deep
---

# resize()
`resize` resize the chart.

::: warning Warning
The container size will always be filled. This method will recalculate the size of each module of the entire chart. Frequent calls may affect performance, so please call with caution.
:::

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/resize.md -->

### Parameters
`resize` does not accept any parameters.

### Returns
`resize` returns `undefined` .

## Usage {#usage}
<script setup>
import Resize from '../../../@views/api/samples/Resize/index.vue'
</script>

### Basic usage {#basic}
<Resize/>