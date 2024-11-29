---
outline: deep
---

# createIndicator(indicator, isStack?, paneOptions?)
`createIndicator` create an indicator.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/createIndicator.md -->

### Parameters
- `indicator` Indicator configuration can be an indicator name or an object. The object parameters are as follows.
  - `name` Name.
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
- `isStack` Whether to stack.
- `paneOptions` Pane configuration.
  - `id` Pane id.
  - `height` Height.
  - `minHeight` Min height.
  - `dragEnabled` Whether the height can be adjusted by dragging.
  - `order` Order.
  - `state` State, supports `normal` , `maximize` and `minimize` .
  - `axis` Axis configuration.
    - `name` The name of the axis.
    - `reverse` Whether to reverse.
    - `inside` Whether it is inside.
    - `position` Position, supports `left` and `right`.
    - `scrollZoomEnabled` Whether to allow scrolling and zooming.
    - `gap` Top and bottom margin configuration.
      - `top` Top margin.
      - `bottom` Bottom margin.

### Returns
`createIndicator` returns pane id `string` or `null` .

## Usage {#usage}
<script setup>
import CreateIndicatorBasic from '../../../@views/api/samples/createIndicator-basic/index.vue'
import CreateIndicatorExtension from '../../../@views/api/samples/custom-indicator-basic/index.vue'
import CreateIndicatorStack from '../../../@views/api/samples/createIndicator-stack/index.vue'
import CreateIndicatorObject from '../../../@views/api/samples/createIndicator-object/index.vue'
import CreateIndicatorPaneOptions from '../../../@views/api/samples/createIndicator-paneOptions/index.vue'
</script>

### Basic usage {#basic}
<CreateIndicatorBasic/>

### Custom indicator {#extension}
<CreateIndicatorExtension/>

### Indicator stack {#stack}
<CreateIndicatorStack/>

### Setting indicator attrs {#attrs}
<CreateIndicatorObject/>

### Setting pane options {#paneOptions}
<CreateIndicatorPaneOptions/>