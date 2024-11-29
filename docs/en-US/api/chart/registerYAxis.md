---
outline: deep
---

# registerYAxis(yAxis)
`registerYAxis`  used to custom y-axis.

## Reference {#reference}
<!--@include: @/@views/api/references/chart/registerYAxis.md-->

### Parameters {#parameters}
- `yAxis` Y-axis configuration.
  - `name` Name, a unique identifier used for creation or modification.
  - `reverse` Whether it is inverted.
  - `inside` Whether it is inside.
  - `position` Position, supports `left` and `right` .
  - `scrollZoomEnabled` Whether scrolling and zooming are possible on the axis.
  - `gap` Top and bottom margin configuration.
    - `top` Top margin.
    - `bottom` Bottom margin.
  - `valueToRealValue` The value is converted into real value callback method.
  - `realValueToDisplayValue` The real value is converted into display value callback method.
  - `displayValueToRealValue` The display value is converted into real value callback method.
  - `realValueToValue` The real value is converted into value callback method.
  - `displayValueToText` The callback method that converts the display value into display text.
  - `minSpan` Minimum span calculation callback method.
  - `createRange` Create an axis value range callback method.
  - `createTicks` Create ticks information callback method.

### 返回值 {#returns}
`registerYAxis` returns `undefined` .

## Usage {#usage}
<script setup>
import RegisterYAxisBasic from '../../../@views/api/samples/registerYAxis/index.vue'
</script>

### Basic usage {#basic}
<RegisterYAxisBasic/>