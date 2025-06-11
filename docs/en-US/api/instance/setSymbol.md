---
outline: deep
---

# setSymbol(symbol)
`setSymbol` set symbol.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setSymbol.md-->

### Parameters {#parameters}
- `symbol` Trading pair information.
  - `ticker` Unique identifier of the transaction pair.
  - `pricePrecision` Price precision.
  - `volumePrecision` Volume precision.

### Returns {#returns}
`setSymbol` returns `undefined` .


## Usage {#usage}
<script setup>
import SetSymbol from '../../../@views/api/samples/setSymbol/index.vue'
</script>

### Basic {#basic}
<SetSymbol/>