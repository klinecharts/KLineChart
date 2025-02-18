---
outline: deep
---

# getIndicators(filter?)
`getIndicators` get indicator information.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/getIndicators.md -->

### Parameters {#parameters}
- `filter` Filter conditions.
  - `id` Indicator id. 
  - `name` Indicator name.
  - `paneId` Pane id.


### Returns {#returns}
`getIndicators` returns `Indicator[]` .

## Usage {#usage}
<script setup>
import GetIndicators from '../../../@views/api/samples/getIndicators/index.vue'
</script>

### Basic usage {#basic}
<GetIndicators/>