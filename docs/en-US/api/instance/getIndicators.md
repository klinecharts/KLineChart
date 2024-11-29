---
outline: deep
---

# getIndicators(filter?)
`getIndicators` get indicator information.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/getIndicators.md -->

### Parameters {#parameters}
- `filter` Filter conditions.
  - `name` Indicator name.
  - `paneId` Pane id.


### Returns {#returns}
`getIndicators` returns `Map<string, Indicator[]>` .

## Usage {#usage}
<script setup>
import GetIndicators from '../../../@views/api/samples/getIndicators/index.vue'
</script>

### Basic usage {#basic}
<GetIndicators/>