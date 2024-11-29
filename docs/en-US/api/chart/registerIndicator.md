---
outline: deep
---

# registerIndicator(indicator)
`registerIndicator` Used custom indicators.

## Reference {#reference}
<!--@include: @/@views/api/references/chart/registerIndicator.md-->

### Parameters {#parameters}
- `indicator` Indicator configuration.
  - `name` Name, a unique identifier used for creation or modification.
  - `shortName` A short name, used for prompt display.
  - `precision` Precision.
  - `calcParams` Calculate the parameters.
  - `shouldOhlc` Whether to show the `ohlc` bar.
  - `shouldFormatBigNumber` Whether big numbers need to be formatted and displayed.
  - `visible` Whether it is visible.
  - `zLevel` Hierarchy only works between indicators.
  - `extendData` Custom the extended data.
  - `series` Series, supports `normal` , `price` and `volume` , when `price` and `precision` is not set, the precision will follow the price precision, when `volume` and `precision` is not set, the precision will follow the volume precision.
  - `figures` Figure configuration, an array of items containing `object` configuration.
    - `key` The identifier of the data value, corresponding to the `key` of the data sub-item returned by `calc`.
    - `type` The type of figure that supports the type returned by `klinecharts.getSupportedFigures` .
    - `baseValue` The basic control value, currently only works when `type` is `rect` and `bar` . When this value is valid, the graphics will be drawn up and down based on this value.
    - `attrs` The property value is a method, and the return value is the required property of the object obtained by `klinecharts.getFigureClass` .
    - `styles` Style is a method that returns the style required by the object obtained by `klinecharts.getFigureClass` .
  - `minValue` Specify a minimum value.
  - `maxValue` Specifies the maximum value.
  - `styles` Style configuration, the type is the same as `indicator` in the general style `Styles`.
  - `shouldUpdate` Control whether updates are needed.
  - `calc` Calculation method.
  - `regenerateFigures` Regenerates the basic graphics configuration. This is triggered when `calcParams` changes. The return value type is the same as `figures` .
  - `createTooltipDataSource` Create custom prompts.
  - `draw` Custom drawing method, if the return value is `true`, it will override the default drawing.
  - `onDataStateChange` Data change callback notification.

### Returns {#returns}
`registerIndicator` returns `undefined` .

## Usage {#usage}
<script setup>
import CustomIndicatorBasic from '../../../@views/api/samples/custom-indicator-basic/index.vue'
import CustomIndicatorCustomFigure from '../../../@views/api/samples/custom-figure-custom-indicator/index.vue'
import CustomIndicatorTooltip from '../../../@views/api/samples/custom-indicator-tooltip/index.vue'
import CustomIndicatorDraw from '../../../@views/api/samples/custom-indicator-draw/index.vue'
</script>

### Basic usage {#basic}
<CustomIndicatorBasic/>

### Using custom figure {#custom-figure}
<CustomIndicatorCustomFigure/>

### custom prompt information {#tooltip}
<CustomIndicatorTooltip/>

### Custom drawing {#draw}
<CustomIndicatorDraw/>