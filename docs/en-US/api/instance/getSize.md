---
outline: deep
---

# getSize(filter?)
`getSize` get the size of the chart.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/getSize.md-->

### Parameters
- `filter` Filter conditions.
  - `paneId` Pane id.
  - `position` Position, supports `root`, `main` and `yAxis` .

### Returns
`getDom` returns a `Bounding` object containing size information or `null` .


## Usage {#usage}
<script setup>
import GetSize from '../../../@views/api/samples/getSize/index.vue'
</script>

### Basic usage {#basic}
<GetSize/>