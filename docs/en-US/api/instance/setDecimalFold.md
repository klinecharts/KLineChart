---
outline: deep
---

# setDecimalFold(decimalFold)
`setDecimalFold` set the chart decimal folding configuration.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/setDecimalFold.md -->

### Parameters {#parameters}
- `decimalFold` Decimal 0 folds the configuration.
  - `threshold` Fold threshold.
  - `format` Custom formatting method.

### Returns {#returns}
`setDecimalFold` returns `undefined` .

## Usage {#usage}
<script setup>
import SetDecimalFoldThreshold from '../../../@views/api/samples/setDecimalFold-threshold/index.vue'
import SetDecimalFoldFormat from '../../../@views/api/samples/setDecimalFold-format/index.vue'
</script>

### Do not fold decimals {#threshold}
<SetDecimalFoldThreshold/>

### Custom format
<SetDecimalFoldFormat/>