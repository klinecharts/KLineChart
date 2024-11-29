---
outline: deep
---

# executeAction(type, data)
`executeAction` executes a chart action.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/executeAction.md -->

### Parameters {#parameters}
- `type` Type, only supports `onCrosshairChange` .
- `data` Data.

### Returns {#returns}
`executeAction` returns `undefined` .

## Usage {#usage}
<script setup>
import ExecuteAction from '../../../@views/api/samples/executeAction/index.vue'
</script>

### Basic usage {#basic}
<ExecuteAction/>