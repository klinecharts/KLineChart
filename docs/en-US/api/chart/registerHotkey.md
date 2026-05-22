---
outline: deep
---

# registerHotkey(hotkey)
`registerHotkey` registers a hot key globally.

## Reference {#reference}
<!--@include: @/@views/api/references/chart/registerHotkey.md-->

### Parameters {#parameters}
- `hotkey` Hot key configuration.
  - `name` Name, used as the global unique identifier. Registering the same name again overrides the existing configuration.
  - `keys` Key combination, can be a string or a string array, such as `R`, `Shift+Equal`, or `['Shift+=', 'Shift+NumpadAdd']`.
  - `preventDefault` Whether to prevent the browser default behavior, default is `true`.
  - `stopPropagation` Whether to stop event propagation, default is `false`.
  - `check` Check before execution. When it returns `false`, `action` will not run.
    - `params.chart` Chart instance that triggered the hot key.
    - `params.event` Original keyboard event.
    - `params.key` Normalized key string.
    - `params.hotkey` Current hot key configuration.
  - `action` Method executed when the hot key is triggered. It receives the same params as `check`.
  - `extendData` Custom extension data.

### Returns {#returns}
`registerHotkey` returns `undefined` .

## Usage {#usage}
<script setup>
import RegisterHotkey from '../../../@views/api/samples/registerHotkey/index.vue'
</script>

### Basic usage {#basic}
<RegisterHotkey/>
