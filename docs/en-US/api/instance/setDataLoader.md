---
outline: deep
---

# setDataLoader(dataLoader)
`setDataLoader` set up the data loader.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setDataLoader.md-->

### Parameters {#parameters}
- `dataLoader` Data loader.
  - `getBars` Get data, which will be triggered when setting the trading pair information, setting the period and dragging the chart to the left or right boundary.
  - `subscribeBar` Subscribing to real-time data will be triggered after setting the trading pair information, setting the period, and `getBars` is completed.
  - `unsubscribeBar` Unsubscribing from real-time data will be triggered after setting the transaction pair information and the period.

### Returns {#returns}
`setDataLoader` returns `undefined` 。


## Usage {#usage}
<script setup>
import SetDataLoader from '../../../@views/api/samples/setDataLoader/index.vue'
</script>

### Basic {#basic}
<SetDataLoader/>