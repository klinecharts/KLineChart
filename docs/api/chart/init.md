---
outline: deep
---

<script setup>
import InitBasic from '../../@views/api/samples/init-basic/index.vue'
import InitLayout from '../../@views/api/samples/init-layout/index.vue'
import InitLocaleBuiltIn from '../../@views/api/samples/init-locale-built-in/index.vue'
import InitLocaleExtension from '../../@views/api/samples/init-locale-extension/index.vue'
import InitTimezone from '../../@views/api/samples/init-timezone/index.vue'
import InitStylesBuiltIn from '../../@views/api/samples/init-styles-built-in/index.vue'
import InitStylesExtension from '../../@views/api/samples/init-styles-extension/index.vue'
import InitStylesOverride from '../../@views/api/samples/init-styles-override/index.vue'
import InitFormatDate from '../../@views/api/samples/init-formateDate/index.vue'
import InitFormatBigNumber from '../../@views/api/samples/init-formatBigNumber/index.vue'
import InitThousandsSeparatorNone from '../../@views/api/samples/init-thousandsSeparator-none/index.vue'
import InitThousandsSeparatorFormat from '../../@views/api/samples/init-thousandsSeparator-format/index.vue'
import InitDecimalFoldNone from '../../@views/api/samples/init-decimalFold-none/index.vue'
import InitDecimalFoldFormat from '../../@views/api/samples/init-decimalFold-format/index.vue'
import InitZoomAnchor from '../../@views/api/samples/init-zoomAnchor/index.vue'
import Tip from '../../@components/Tip.vue'
</script>

# init(ds, options?)
`init` 用于初始化一个图表。

<Tip title="提示" :tip="['调用时，需要等待容器准备完成之后。']"/>

## 参考 {#reference}
<!-- @include: @/@views/api/references/chart/init.md -->

### 参数 {#parameters}
- `ds` 容器，可以是dom元素或者元素id。
- `options` 可选配置项。
  - `layout` 自定义布局配置。
    - `basicParams` 布局基础参数。
      - `barSpaceLimitMin` 柱间距最小值。
      - `barSpaceLimitMax` 柱间距最大值。
      - `yAxisPosition` 默认 y 轴位置，支持 `left` 和 `right` 。
      - `yAxisInside` 默认 y 轴是否在窗口内部。
      - `paneMinHeight` 默认窗口最小高度。
      - `paneHeight` 默认窗口高度。
    - `panes` 自定义窗口列表。
      - `type` 窗口类型，支持 `candle` ，`indicator` 和 `xAxis` 。
      - `content` 窗口内容，仅支持指标。子项可以是指标名、指标配置，或 `{ indicator, yAxis }`。
        - `indicator` 指标名或指标配置。
        - `yAxis` 指标绑定的 y 轴配置，不需要传 `paneId` 。
      - `options` 窗口配置。
        - `id` 窗口id。
        - `height` 高度。
        - `minHeight` 最小高度。
        - `dragEnabled` 是否可以拖拽调整高度。
        - `order` 顺序。
        - `state` 状态，支持 `normal` ， `maximize` 和 `minimize` 。
  - `locale` 语言，内置支持 `zh-CN` 和 `en-US` 。
  - `timezone` 时区名，如 `Asia/Shanghai` ，如果不设置会自动获取本机时区，时区对应名字列表请参阅 [时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) 。
  - `styles` 可以是通过 `klinecharts.registerStyles` 注册的样式名，也可以是 `Styles` ， `Styles` 详情参阅 [样式](/guide/styles) ，支持增量。
  - `formatter` 一些格式化api。
    - `formatDate` 格式化日期。
    - `formatBigNumber` 格式化大的数字，如1000转换成1k，1000000转换为1M等。
    - `formatExtendText` 格式化扩展文案。
  - `thousandsSeparator` 千分符配置。
    - `sign` 标识符。
    - `format` 自定义格式化方法。
  - `decimalFold` 小数 0 折叠配置。
    - `threshold` 折叠阈值。
    - `format` 自定义格式化方法。
  - `zoomAnchor` 缩放锚点位置，可以是 `last_bar` 、 `cursor` ，或分别配置主图和 x 轴的对象 `{ main, xAxis }`。
  - `hotkey` 快捷键配置。
    - `enabled` 是否启用快捷键。
    - `exclude` 排除的全局快捷键名称列表。

### 返回值 {#returns}
`init` 返回一个图表实例对象 `Chart`。

## 用法 {#usage}

### 基本使用 {#basic}
<InitBasic/>

### 自定义布局 {#layout}
<InitLayout />

### 内置语言 {#init-locale-built-in}
<InitLocaleBuiltIn />

### 自定义扩展语言 {#init-locale-extension}
<InitLocaleExtension />

### 设置时区 {#init-timezone}
<InitTimezone />

### 内置样式模版 {#init-styles-built-in}
<InitStylesBuiltIn />

### 自定义样式模版 {#init-styles-extension}
<InitStylesExtension />

### 样式直接覆盖 {#init-styles-override}
<InitStylesOverride />

### 自定义时间显示 {#init-formatDate}
<InitFormatDate />

### 自定义大数字显示 {#init-formatBigNumber}
<InitFormatBigNumber />

### 不显示千分符 {#init-thousandsSeparator-none}
<InitThousandsSeparatorNone/>

### 自定义千分符显示 {#init-thousandsSeparator-format}
<InitThousandsSeparatorFormat />

### 小数 0 不折叠 {#init-decimalFold-none}
<InitDecimalFoldNone/>

### 小数 0 折叠自定义显示 {#init-decimalFold-format}
<InitDecimalFoldFormat />

### 缩放位置{#init-zoomAnchor}
<InitZoomAnchor />
