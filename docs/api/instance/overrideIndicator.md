---
outline: deep
---

# overrideIndicator(indicator, paneId?)
`overrideIndicator` 覆盖指标属性。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/overrideIndicator.md -->

### 参数
- `indicator` 指标配置。
  - `name` 名称。
  - `shortName` 简短名称，用于提示显示。
  - `precision` 精度。
  - `calcParams` 计算参数。
  - `shouldOhlc` 是否需要显示 `ohlc` 柱。
  - `shouldFormatBigNumber` 是否需要将大数字格式化显示。
  - `visible` 是否可见。
  - `zLevel` 层级，只作用于指标与指标之间。
  - `extendData` 自定义扩展数据。
  - `series` 系列，支持 `normal` ， `price` 和 `volume` ，当是 `price` 并且没有设置 `precision` 时，精度将随着价格精度变化，当是 `volume` 并且没有设置 `precision` 时，精度将随数量精度变化。
  - `figures` 图形配置，是一个数组，子项是包含配置的 `object` 。
    - `key` 数据取值的标识，与 `calc` 返回的数据子项的 `key` 对应。
    - `type` 图形类型，支持 `klinecharts.getSupportedFigures` 返回值存在的类型。
    - `baseValue` 基本对照值，目前仅仅作用于 `type` 是 `rect` 和 `bar` 的时候，当此值有效时，图形将会以此值为基准上下绘制。
    - `attrs` 属性值，是一个方法，返回值是 `klinecharts.getFigureClass` 得到的对象所需要的属性。
    - `styles` 样式，是一个方法，返回值是 `klinecharts.getFigureClass` 得到的对象所需要的样式。
  - `minValue` 指定最小值。
  - `maxValue` 指定最大值。
  - `styles` 样式配置，类型同通用样式 `Styles` 中的 `indicator` 。
  - `shouldUpdate` 手动控制是否需要更新。
  - `calc` 计算方法。
  - `regenerateFigures` 重新生成基础图形配置，当 `calcParams` 变化时触发，返回值类型同 `figures` 。
  - `createTooltipDataSource` 创建自定义的提示信息。
  - `draw` 自定义绘制方法，如果返回值是 `true` ，则会覆盖默认的绘制。
  - `onDataStateChange` 数据变化回调通知。
- `paneId` 窗口id。

### 返回值
`overrideIndicator` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import OverrideIndicatorBasic from '../../@views/api/samples/overrideIndicator-basic/index.vue'
import OverrideIndicatorPaneId from '../../@views/api/samples/overrideIndicator-paneId/index.vue'
</script>

### 基本使用 {#basic}
<OverrideIndicatorBasic/>

### 覆盖指定窗口上的指标属性 {#paneId}
<OverrideIndicatorPaneId/>