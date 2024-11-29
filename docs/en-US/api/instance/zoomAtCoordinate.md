---
outline: deep
---

# zoomAtCoordinate(scale, coordinate?, animationDuration?)
`zoomAtCoordinate` zoom at the specified coordinates.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/zoomAtCoordinate.md -->

### Parameters {#parameters}
- `scale` Scaling.
- `coordinate` Coordinate.
  - `x` X-axis.
  - `y` Y-axis
- `animationDuration` Animation duration. If it is less than or equal to 0, there is no animation.

### Returns {#returns}
`zoomAtCoordinate` returns `undefined` .

## Usage {#usage}
<script setup>
import ZoomAtCoordinate from '../../../@views/api/samples/zoomAtCoordinate/index.vue'
</script>

### Basic usage {#basic}
<ZoomAtCoordinate/>