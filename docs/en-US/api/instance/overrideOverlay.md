---
outline: deep
---

# overlayOverlay(overlay)
`overlayOverlay` override overlay attrs.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/overrideOverlay.md-->

### Parameters {#parameters}
- `overlay` Overlay configuration.
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

### Returns {#returns}
`overlayOverlay` returns `boolean` .

## Usage {#usage}
<script setup>
import OverrideOverlayBasic from '../../../@views/api/samples/overrideOverlay-basic/index.vue'
import OverrideOverlayName from '../../../@views/api/samples/overrideOverlay-name/index.vue'
import OverrideOverlayGroupId from '../../../@views/api/samples/overrideOverlay-groupId/index.vue'
</script>

### Basic usage {#basic}
<OverrideOverlayBasic/>

### Override attrs by name {#name}
<OverrideOverlayName/>

### Override attrs by group id {#groupId}
<OverrideOverlayGroupId/>

