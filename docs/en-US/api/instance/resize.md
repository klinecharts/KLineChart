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
  :tip="['The chart listens to container size changes and updates the layout automatically by default. This method recalculates the size of each module of the entire chart, so it is usually only needed for special cases. Frequent calls may affect performance.']"/>


## Reference {#reference}
<!-- @include: @/@views/api/references/instance/resize.md -->

### Parameters {#parameters}
`resize` does not accept any parameters.

### Returns {#returns}
`resize` returns `undefined` .

## Usage {#usage}

### Basic usage {#basic}
<Resize/>
