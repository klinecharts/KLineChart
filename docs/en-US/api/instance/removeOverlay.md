---
outline: deep
---

# removeOverlay(filter?)
`removeOverlay` remove overlay.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/removeOverlay.md -->

### Parameters
- `filter` Filter conditions.
  - `id` Overlay id.
  - `name` Overlay name.
  - `groupId` Group id.
  - `paneId` Pane id.

### Returns
`removeOverlay` returns `boolean` .

## Usage {#usage}
<script setup>
import RemoveOverlayBasic from '../../../@views/api/samples/removeOverlay-basic/index.vue'
import RemoveOverlayName from '../../../@views/api/samples/removeOverlay-name/index.vue'
import RemoveOverlayGroupId from '../../../@views/api/samples/removeOverlay-groupId/index.vue'
</script>

### Basic usage {#basic}
<RemoveOverlayBasic/>

### Remove by name {#name}
<RemoveOverlayName/>

### Remove by group id {#groupId}
<RemoveOverlayGroupId/>