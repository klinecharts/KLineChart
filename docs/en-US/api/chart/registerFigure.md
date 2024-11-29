---
outline: deep
---

# registerFigure(figure)
`registerFigure` used to custom figure.

## Reference {#reference}
<!--@include: @/@views/api/references/chart/registerFigure.md-->

### Parameters
- `figure` Figure configuration.
  - `name` Name, unique identifier.
  - `draw` Drawing method.
  - `checkEventOn` Checks if the event is on a figure.


### Returns
`registerFigure` returns `undefined` 。

## Usage {#usage}
<script setup>
import CustomFigureCustomIndicator from '../../../@views/api/samples/custom-figure-custom-indicator/index.vue'
import CustomFigureCustomOverlay from '../../../@views/api/samples/custom-figure-custom-overlay/index.vue'
</script>

### Used in custom indicators {#usage-custom-indicator}
<CustomFigureCustomIndicator />

### Used in custom overlays {#usage-custom-overlay}
<CustomFigureCustomOverlay />