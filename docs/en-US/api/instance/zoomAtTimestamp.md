---
outline: deep
---

# zoomAtTimestamp(scale, timestamp, animationDuration?)
`zoomAtTimestamp` zoom to the specified timestamp.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/zoomAtTimestamp.md -->

### Parameters
- `scale` Scaling.
- `timestamp` Timestamp.
- `animationDuration` Animation duration. If it is less than or equal to 0, there is no animation.

### Returns
`zoomAtTimestamp` returns `undefined` .

## Usage {#usage}
<script setup>
import ZoomAtTimestamp from '../../../@views/api/samples/zoomAtTimestamp/index.vue'
</script>

### Basic usage {#basic}
<ZoomAtTimestamp/>