---
outline: deep
---

# setHotkey(hotkey)
`setHotkey` sets the hot key configuration.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setHotkey.md-->

### Parameters {#parameters}
- `hotkey` Hot key configuration.
  - `enabled` Whether hot keys are enabled.
  - `exclude` Global hot key names to exclude.

### Returns {#returns}
`setHotkey` returns `undefined` .

## Usage {#usage}
<script setup>
import SetHotkey from '../../../@views/api/samples/setHotkey/index.vue'
</script>

### Basic {#basic}
<SetHotkey/>
