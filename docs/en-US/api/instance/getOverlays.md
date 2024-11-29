---
outline: deep
---

# getOverlays(filter?)
`getOverlays` get overlay information.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/getOverlays.md -->

### Parameters
- `filter` Filter conditions.
  - `id` Overlay id.
  - `name` Overlay name.
  - `groupId` Group id.
  - `paneId` Pane id.


### Returns
`getOverlays` returns `Map<string, Overlay[]>` .

## Usage {#usage}
<script setup>
import GetOverlays from '../../../@views/api/samples/getOverlays/index.vue'
</script>

### Basic usage {#basic}
<GetOverlays/>