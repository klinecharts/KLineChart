---
outline: deep
---

# setBarSpaceLimit(limit)
`setBarSpaceLimit` set the limit size of the space that a single candlestick on the chart should occupy.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setBarSpaceLimit.md-->

### Parameters {#parameters}
- `limit` The limit size of the space 
  - `min` min value of the space 
  - `max` max value of the space 

### Returns {#returns}
`setBarSpaceLimit` returns `undefined` 。

## Usage {#usage}
<script setup>
import setBarSpaceLimit from '../../../@views/api/samples/setBarSpaceLimit/index.vue'
</script>

### Basic usage {#basic}
<setBarSpaceLimit/>