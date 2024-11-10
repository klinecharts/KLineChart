---
aside: false
---

# init(ds, options?)
`init` 用于初始化一个图表。

<!--@include: @/@views/api/chart/init/api.md-->

::: tip 提示
调用时，需要等待容器 `dom` 准备完成之后。
:::

- [参考](#reference)
- [用法](#usage)
  - [使用 `options.layout` 在初始化的时候创建好指标](#init-layout-basic)
  - [使用 `options.layout` 在初始化的时候改变时间轴默认位置](#init-layout-order)
  - [使用 `options.locale` 使用内置的语言在初始化的时候设置图表语言](#init-locale-built-in)
  - [使用 `options.locale` 和 `klinecharts.registerLocale` 在初始化的时候设置自定义语言](#init-locale-extension)
  - [使用 `options.timezone` 在初始化的时候设置时区](#init-timezone)
  - [使用 `options.styles` 使用内置样式模版在初始化的时候设置图表样式](#init-styles-built-in)
  - [使用 `options.styles` 直接使用样式配置在初始化的时候设置图表样式](#init-styles-object)
  - [使用 `options.styles` 和 `klinecharts.registerStyles` 在初始化的时候设置图表样式](#init-styles-extension)
  - [使用 `options.customApi` 改变图表上的时间和超大数据显示](#init-customapi)
  - [使用 `options.thousandsSeparator` 改变千分符显示](#init-thousandsseparator)
  - [使用 `options.decimalFold` 改变小数 0 折叠显示](#init-decimalfold)

## 参考 {#reference}
<!--@include: @/@views/api/chart/init/reference.md-->

### 参数
- `ds` 容器，可以是dom元素或者元素id。
- `options` 可选配置项。
  - `layout` 自定义布局， `content` 中的内容和 `options` 参考实例方法 [createIndicator](./instance-api#createindicator-value-isstack-paneoptions-callback) 中的入参 `value` 和 `options` 。
  - `locale` 语言，内置支持 `zh-CN` 和 `en-US` 。
  - `timezone` 时区名，如 `Asia/Shanghai` ，如果不设置会自动获取本机时区，时区对应名字列表请参阅 [时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) 。
  - `styles` 可以是通过 `klinecharts.registerStyles` 注册的样式名，也可以是 object，样式列表，详情参阅 [样式](./styles.md) ，支持增量。
  - `customApi` 自定义一些api。
    - `formatDate` 格式化日期。
    - `formatBigNumber` 格式化大的数字，如1000转换成1k，1000000转换为1M等。
  - `thousandsSeparator` 千分符配置。
    - `sign` 标识符。
    - `format` 自定义格式化方法。
  - `decimalFold` 小数 0 折叠配置。
    - `type` 类型，内置了 `curlyBracket` 和 `subscript` 。
    - `threshold` 折叠阈值。
    - `format` 自定义格式化方法。

### 返回值
`init` 返回一个图表实例对象 `chart`。

<script setup>
import InitOptionsLayoutBasic from '../../@views/api/samples/init-options-layout-basic/index.vue'
import InitOptionsLayoutOrder from '../../@views/api/samples/init-options-layout-order/index.vue'
import InitOptionsLocaleBuiltIn from '../../@views/api/samples/init-options-locale-built-in/index.vue'
import InitOptionsLocaleExtension from '../../@views/api/samples/init-options-locale-extension/index.vue'
import InitOptionsTimezone from '../../@views/api/samples/init-options-timezone/index.vue'
import InitOptionsStylesBuiltIn from '../../@views/api/samples/init-options-styles-built-in/index.vue'
import InitOptionsStylesObject from '../../@views/api/samples/init-options-styles-object/index.vue'
import InitOptionsStylesExtension from '../../@views/api/samples/init-options-styles-extension/index.vue'
import InitOptionsCustomApi from '../../@views/api/samples/init-options-customapi/index.vue'
import InitOptionsThousandsSeparator from '../../@views/api/samples/init-options-thousandsseparator/index.vue'
import InitOptionsDecimalFold from '../../@views/api/samples/init-options-decimalfold/index.vue'
</script>

## 用法 {#usage}
### 使用 `options.layout` 在初始化的时候创建好指标 {#init-layout-basic}
<InitOptionsLayoutBasic />

### 使用 `options.layout` 在初始化的时候改变时间轴默认位置 {#init-layout-order}
<InitOptionsLayoutOrder />

### 使用 `options.locale` 使用内置的语言在初始化的时候设置图表语言， {#init-locale-built-in}
<InitOptionsLocaleBuiltIn />

### 使用 `options.locale` 和 `klinecharts.registerLocale` 在初始化的时候设置自定义语言 {#init-locale-extension}
<InitOptionsLocaleExtension />

### 使用 `options.timezone` 在初始化的时候设置时区 {#init-timezone}
<InitOptionsTimezone />

### 使用 `options.styles` 使用内置样式模版在初始化的时候设置图表样式 {#init-styles-built-in}
<InitOptionsStylesBuiltIn />

### 使用 `options.styles` 直接使用样式配置在初始化的时候设置图表样式 {#init-styles-object}
<InitOptionsStylesObject />

### 使用 `options.styles` 和 `klinecharts.registerStyles` 在初始化的时候设置图表样式 {#init-styles-extension}
<InitOptionsStylesExtension />

### 使用 `options.customApi` 改变图表上的时间和超大数据显示 {#init-customapi}
<InitOptionsCustomApi />

### 使用 `options.thousandsSeparator` 改变千分符显示 {#init-thousandsseparator}
<InitOptionsThousandsSeparator />

### 使用 `options.decimalFold` 改变小数 0 折叠显示 {#init-decimalfold}
<InitOptionsDecimalFold />


