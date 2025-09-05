---
outline: deep
---

<script setup>
import Resize from '../../../@views/api/samples/Resize/index.vue'
import Tip from '../../../@components/Tip.vue'
</script>

# resize()
`resize` resize the chart.

<Tip
  type="warn"
  title="Note"
  tip="The container size will always be filled. This method will recalculate the size of each module of the entire chart. Frequent calls may affect performance, so please call with caution."/>


## Reference {#reference}
<!-- @include: @/@views/api/references/instance/resize.md -->

### Parameters {#parameters}
`resize` does not accept any parameters.

### Returns {#returns}
`resize` returns `undefined` .

## Usage {#usage}

### Basic usage {#basic}
<Resize/>