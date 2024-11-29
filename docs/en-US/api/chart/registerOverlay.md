---
outline: deep
---

# registerOverlay(overlay)
`registerOverlay` used to custom overlay.

## Reference {#reference}
<!-- @include: @/@views/api/references/chart/registerOverlay.md -->

### Parameters {#parameters}
- `overlay` Overlay configuration.
  - `name` Name, a unique identifier used for creation or modification.
  - `totalStep` Total implementation steps.
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
  - `createPointFigures` Create figures corresponding to the points.
  - `createXAxisFigures` Create figures corresponding to the x-axis.
  - `createYAxisFigures` Create figures corresponding to the y-axis.
  - `performEventPressedMove` Special processing method for press and hold movement events.
  - `performEventMoveForDrawing` Special processing methods during mobile events.
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
`registerOverlay` returns `undefined` .

## Usage {#usage}
<script setup>
import CustomOverlayBasic from '../../../@views/api/samples/custom-overlay-basic/index.vue'
import CustomOverlayCustomFigure from '../../../@views/api/samples/custom-figure-custom-overlay/index.vue'
</script>

### Basic usage {#basic}
<CustomOverlayBasic/>

### Using custom figure {#custom-figure}
<CustomOverlayCustomFigure/>