---
outline: deep
---

# setThousandsSeparator(thousandsSeparator)
`setThousandsSeparator` set the chart thousands separator configuration.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setThousandsSeparator.md-->

### Parameters
- `thousandsSeparator` Thousand separator configuration.
  - `sign` Sign.
  - `format` Custom formatting method.

### Returns
`setThousandsSeparator` returns `undefined` .

## Usage {#usage}
<script setup>
import SetThousandsSeparatorSign from '../../../@views/api/samples/setThousandsSeparator-sign/index.vue'
import SetThousandsSeparatorFormat from '../../../@views/api/samples/setThousandsSeparator-format/index.vue'
</script>

### Do not display thousands separators {#sign}
<SetThousandsSeparatorSign/>

### Custom format {#format}
<SetThousandsSeparatorFormat/>