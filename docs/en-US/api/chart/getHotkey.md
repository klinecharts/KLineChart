---
outline: deep
---

# getHotkey(name)
`getHotkey` gets a registered hot key configuration.

## Reference {#reference}
<!--@include: @/@views/api/references/chart/getHotkey.md-->

### Parameters {#parameters}
- `name` Hot key name.

### Returns {#returns}
`getHotkey` returns `HotkeyTemplate` or `null` .

## Usage {#usage}
<script setup>
import GetHotkey from '../../../@views/api/samples/getHotkey-chart/index.vue'
</script>

### Basic usage {#basic}
<GetHotkey/>
