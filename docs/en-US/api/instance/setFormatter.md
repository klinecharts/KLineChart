---
outline: deep
---

# setFormatter(formatter)
`setFormatter` set some format APIs for charts.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setFormatter.md-->

### Parameters {#parameters}
- `formatter` Format APIs.
  - `formatDate` Formats a date.
  - `formatBigNumber` Format big numbers, such as 1000 is converted to 1k, 1000000 is converted to 1M, etc.

### Returns {#returns}
`setFormatter` returns `undefined` .

## Usage {#usage}
<script setup>
import SetFormatterFormatDate from '../../../@views/api/samples/setFormatter-formatDate/index.vue'
import SetFormatterFormatBigNumber from '../../../@views/api/samples/setFormatter-formatBigNumber/index.vue'
</script>

### Format date {#formatDate}
<SetFormatterFormatDate/>

### Format big number {#formatBigNumber}
<SetFormatterFormatBigNumber/>