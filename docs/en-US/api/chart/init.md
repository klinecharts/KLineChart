---
outline: deep
---

<script setup>
import InitBasic from '../../../@views/api/samples/init-basic/index.vue'
import InitLayout from '../../../@views/api/samples/init-layout/index.vue'
import InitLocaleBuiltIn from '../../../@views/api/samples/init-locale-built-in/index.vue'
import InitLocaleExtension from '../../../@views/api/samples/init-locale-extension/index.vue'
import InitTimezone from '../../../@views/api/samples/init-timezone/index.vue'
import InitStylesBuiltIn from '../../../@views/api/samples/init-styles-built-in/index.vue'
import InitStylesExtension from '../../../@views/api/samples/init-styles-extension/index.vue'
import InitStylesOverride from '../../../@views/api/samples/init-styles-override/index.vue'
import InitFormatDate from '../../../@views/api/samples/init-formateDate/index.vue'
import InitFormatBigNumber from '../../../@views/api/samples/init-formatBigNumber/index.vue'
import InitThousandsSeparatorNone from '../../../@views/api/samples/init-thousandsSeparator-none/index.vue'
import InitThousandsSeparatorFormat from '../../../@views/api/samples/init-thousandsSeparator-format/index.vue'
import InitDecimalFoldNone from '../../../@views/api/samples/init-decimalFold-none/index.vue'
import InitDecimalFoldFormat from '../../../@views/api/samples/init-decimalFold-format/index.vue'
import InitZoomAnchor from '../../../@views/api/samples/init-zoomAnchor/index.vue'
import Tip from '../../../@components/Tip.vue'
</script>

# init(ds, options?)
`init` used to initialize a chart.

<Tip title="Tip" tip="When calling, you need to wait until the container is ready."/>

## Reference {#reference}
<!-- @include: @/@views/api/references/chart/init.md -->

### Parameters {#parameters}
- `ds` Container, which can be a DOM element or an element id.
- `options` Optional configuration item.
  - `layout` Custom layout, an array.
    - `type` Pane type, supports `candle` , `indicator` and `xAxis` .
    - `content` Pane content, only supports indicators.
    - `options` Pane configuration.
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
        - `createRange` Create an axis value range callback method.
        - `createTicks` Create ticks information callback method.
  - `locale` Locale, with built-in support for `zh-CN` and `en-US` .
  - `timezone` Timezone name, such as `Asia/Shanghai` . If not set, the local time zone will be automatically obtained. For a list of time zone names, please refer to the [Timezone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) .
  - `styles` It can be a style name registered by `klinecharts.registerStyles` or `Styles` . For details about `Styles` , see [Styles](/en-US/guide/styles). Incremental values ​​are supported.
  - `formatter` Some format APIs.
    - `formatDate` Formats a date.
    - `formatBigNumber` Format big numbers, such as 1000 is converted to 1k, 1000000 is converted to 1M, etc.
  - `thousandsSeparator` Thousand separator configuration.
    - `sign` Sign.
    - `format` Custom formatting method.
  - `decimalFold` Decimal 0 folds the configuration.
    - `threshold` Fold threshold.
    - `format` Custom formatting method.
  - `zoomAnchor` Set the anchor position when zooming the chart to `last_bar` or `cursor`

### Returns {#returns}
`init` returns an object `Chart`。

## Usage {#usage}

### Basic usage {#basic}
<InitBasic/>

### Custom Layout {#layout}
<InitLayout />

### Built-in locales {#init-locale-built-in}
<InitLocaleBuiltIn />

### Custom extension locale {#init-locale-extension}
<InitLocaleExtension />

### Set the timezone {#init-timezone}
<InitTimezone />

### Built-in style templates {#init-styles-built-in}
<InitStylesBuiltIn />

### Custom style templates {#init-styles-extension}
<InitStylesExtension />

### Style override {#init-styles-override}
<InitStylesOverride />

### Custom time display {#init-formatDate}
<InitFormatDate />

### Custom big decimal display {#init-formatBigNumber}
<InitFormatBigNumber />

### Do not display thousands separators {#init-thousandsSeparator-none}
<InitThousandsSeparatorNone/>

### Custom the display of thousands separators {#init-thousandsSeparator-format}
<InitThousandsSeparatorFormat />

### Decimal 0 is not folded {#init-decimalFold-none}
<InitDecimalFoldNone/>

### Decimal 0 fold custom display {#init-decimalFold-format}
<InitDecimalFoldFormat />

### Set the zoom anchor position when zooming the chart to 'last_bar' {#init-zoomAnchor}
<InitZoomAnchor />

