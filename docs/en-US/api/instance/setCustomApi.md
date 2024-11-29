---
outline: deep
---

# setCustomApi(customApi)
`setCustomApi` set some built-in APIs for charts.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setCustomApi.md-->

### Parameters
- `customApi` Customize some APIs.
  - `formatDate` Formats a date.
  - `formatBigNumber` Format big numbers, such as 1000 is converted to 1k, 1000000 is converted to 1M, etc.

### Returns
`setCustomApi` returns `undefined` .

## Usage {#usage}
<script setup>
import SetCustomApiFormatDate from '../../../@views/api/samples/setCustomApi-formatDate/index.vue'
import SetCustomApiFormatBigNumber from '../../../@views/api/samples/setCustomApi-formatBigNumber/index.vue'
</script>

### Format date {#formatDate}
<SetCustomApiFormatDate/>

### Format big number {#formatBigNumber}
<SetCustomApiFormatBigNumber/>