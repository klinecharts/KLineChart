---
outline: deep
---

# init(ds, options?)
`init` 用于初始化一个图表。

::: tip 提示
调用时，需要等待容器 `dom` 准备完成之后。
:::

## 参考 {#reference}
<!--@include: @/@views/api/chart/init/reference.md-->

### 参数
- `ds` 容器，可以是dom元素或者元素id。
- `options` 可选配置项。
  - `layout` 自定义布局，是一个数组。
    - `type` 窗口类型，支持 `candle` ，`indicator` 和 `xAxis` 。
    - `content` 窗口内容，仅仅支持指标。
    - `options` 窗口配置。
      - `id` 窗口id。
      - `height` 高度。
      - `minHeight` 最小高度。
      - `dragEnabled` 是否可以拖拽调整高度。
      - `order` 顺序。
      - `state` 状态，支持 `normal` ， `maximize` 和 `minimize` 。
      - `axis` 坐标轴配置。
        - `name` 坐标轴名称。
        - `reverse` 是否反向。
        - `inside` 是否在内部。
        - `position` 位置，支持 `left` 和 `right` 。
        - `scrollZoomEnabled` 是否允许滚动缩放。
        - `gap` 上下边距配置。
          - `top` 上边距。
          - `bottom` 下边距。
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
    - `type` 支持 `curlyBracket` 和 `subscript` 。
    - `threshold` 折叠阈值。
    - `format` 自定义格式化方法。

### 返回值
`init` 返回一个图表实例对象 `chart`。

<script setup>
import InitBasic from '../../@views/api/samples/init-basic/index.vue'
import InitLayout from '../../@views/api/samples/init-layout/index.vue'
import InitLocaleBuiltIn from '../../@views/api/samples/init-locale-built-in/index.vue'
import InitLocaleExtension from '../../@views/api/samples/init-locale-extension/index.vue'
import InitTimezone from '../../@views/api/samples/init-timezone/index.vue'
import InitStylesBuiltIn from '../../@views/api/samples/init-styles-built-in/index.vue'
import InitStylesExtension from '../../@views/api/samples/init-styles-extension/index.vue'
import InitStylesObject from '../../@views/api/samples/init-styles-object/index.vue'
import InitFormatDate from '../../@views/api/samples/init-formateDate/index.vue'
import InitFormatBigNumber from '../../@views/api/samples/init-formatBigNumber/index.vue'
import InitThousandsSeparator from '../../@views/api/samples/init-thousandsSeparator/index.vue'
import InitDecimalFoldNormal from '../../@views/api/samples/init-decimalFold-normal/index.vue'
import InitDecimalFoldType from '../../@views/api/samples/init-decimalFold-type/index.vue'
import InitDecimalFoldFormat from '../../@views/api/samples/init-decimalFold-format/index.vue'
</script>

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

### 样式直接覆盖 {#init-styles-object}
<InitStylesObject />

### 自定义时间显示 {#init-formatDate}
<InitFormatDate />

### 自定义大数字显示 {#init-formatBigNumber}
<InitFormatBigNumber />

### 千分符显示 {#init-thousandsSeparator}
<InitOptionsThousandsSeparator />

### 小数 0 不折叠 {#init-decimalFold-normal}
<InitDecimalFoldNormal/>

### 小数 0 折叠下标显示 {#init-decimalFold-type}
<InitDecimalFoldType />

### 小数 0 折叠自定义显示 {#init-decimalFold-format}
<InitDecimalFoldFormat />
