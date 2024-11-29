---
outline: deep
---

# createOverlay(value)
`createOverlay` create an overlay.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/createOverlay.md-->

### Parameters
- `value` Overlay configuration, which can be an overlay name, an overlay object, or an array of overlay names and objects.
  - `name` Overlay name.
  - `id` Overlay id.
  - `groupId` Group id.
  - `paneId` Pane id.
  - `lock` Whether to lock and prevent dragging.
  - `visible` Whether it is visible.
  - `zLevel` Drawing level, the larger the value, the closer it is displayed to the front, and it only works between the overlays.
  - `needDefaultPointFigure` Whether the default point corresponding figures are required.
  - `needDefaultXAxisFigure` Whether to use the default x-axis for the figure.
  - `needDefaultYAxisFigure`Whether to use the default y-axis for the figure.
  - `mode` Mode, supports `normal` , `weak_magnet` and `strong_magnet` .
  - `modeSensitivity` Mode sensitivity, only valid when mode is `weak_magnet` .
  - `points` Point information.
  - `extendData` Custom the extend data.
  - `styles` Style configuration.
  - `onDrawStart` Start drawing event.
  - `onDrawing` Drawing event.
  - `onDrawEnd` Drawing end event.
  - `onClick` Click event.
  - `onDoubleClick` Double click event.
  - `onRightClick` Right click event.
  - `onPressedMoveStart` Press and hold to start moving the event.
  - `onPressedMoving` Press and hold the moving event.
  - `onPressedMoveEnd` Press and hold to end the move event.
  - `onMouseEnter` Mouse enter event.
  - `onMouseLeave` Mouse leave event.
  - `onRemoved` Delete event.
  - `onSelected` Select the event.
  - `onDeselected` Deselect the event.

### Returns
`createOverlay` returns `string` or `null` or `Array<string | null>` .

## Usage {#usage}
<script setup>
import CreateOverlayBasic from '../../../@views/api/samples/createOverlay-basic/index.vue'
import CreateOverlayExtension from '../../../@views/api/samples/custom-figure-custom-overlay/index.vue'
import CreateOverlayPoints from '../../../@views/api/samples/createOverlay-points/index.vue'
import CreateOverlayBatch from '../../../@views/api/samples/createOverlay-batch/index.vue'
</script>

### Basic usage {#basic}
<CreateOverlayBasic/>

### Custom overlay {#extension}
<CreateOverlayExtension/>

### Create at once {#points}
<CreateOverlayPoints/>

### Batch create {#batch}
<CreateOverlayBatch/>
