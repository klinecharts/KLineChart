---
outline: deep
---

# setPeriod(period)
`setPeriod` set period.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setPeriod.md-->

### Parameters {#parameters}
- `period` Period.
  - `type` Type, support `second` , `minute` , `hour` , `day` , `week` , `month` and `year` .
  - `span` Time span.

### Returns {#returns}
`setPeriod` returns `undefined` .


## Usage {#usage}
<script setup>
import SetPeriod from '../../../@views/api/samples/setPeriod/index.vue'
</script>

### Basic {#basic}
<SetPeriod/>