# 版本日志

## 5.6.0
`2020-08-29`
+ 🆕 自定义技术指标新增`render`属性。
+ 🆕 自定义指标方法`calcTechnicalIndicator`，增加参数`plots`。
+ 🆕 配置项新增`xAxis.height`和`yAxis.width`。
+ 🆕 新增方法`subscribeDrawAction`和`unsubscribeDrawAction`，用于绘制监听和取消。
+ 🆕 新增方法`getTimezone`。
+ 👉 方法`getTechnicalIndicatorParamOptions`变更为`getTechnicalIndicatorParams`。
+ 👉 内置指标文字提示显示`xxxMa`变更为`maXxx`。
+ 🗑 去除配置项`floatLayer.prompt.technicalIndicator.point`。


## 5.5.1
`2020-08-16`
+ 💄 优化无数据时，y轴显示。
+ 💄 优化默认主图技术指标类型，默认图表更纯粹。
+ 💄 优化性能，减少无用的计算。
+ 🐞 修复切换图表类型和新增副图指标y轴不能显示和显示不对问题。
+ 🐞 修复当配置是方法时，不能正确合并的问题。
+ 👉 `xAxis.tickText.margin`变更为`xAxis.tickText.paddingTop`和`xAxis.tickText.paddingBottom`。
+ 👉 `yAxis.tickText.margin`变更为`yAxis.tickText.paddingLeft`和`yAxis.tickText.paddingRight`。


## 5.5.0
`2020-07-26`
+ 🆕 重新加回技术指标ohlc显示。
+ 🆕 新增文字`weight`配置。
+ 🆕 自定义技术指标新增`shouldFormatBigNumber`属性，用于告知图表是否需要格式化比较大的数字。
+ 🆕 新增方法`setTechnicalIndicatorPrecision`。
+ 💄 优化鼠标移开图表后，提示数据展示，改为展示最后一条数据。
+ 💄 优化加载新数据时，图表绘制起始位置。
+ 💄 优化内部dom元素层级，减少嵌套。
+ 💄 优化`VOL`技术指标提示文字显示。
+ 🐞 修复不合法的技术指标计算参数，可能会导致图表崩溃的问题。
+ 👉 样式配置`yAxis.tickText.position`变更为`yAxis.inside`。
+ 👉 默认字体配置由`Arial`变更为`Helvetica Neue`。
+ 👉 自定义技术指标属性`isPriceTechnicalIndicator`变为`series`，值变更为`price`、`volume`和`normal`。
+ 🗑 去除横坐标轴`minHeight`和`maxHeight`配置，改为高度自适应。
+ 🗑 去除纵坐标轴`minWidth`和`maxWidth`配置，改为宽度自适应。

## 5.3.0
`2020-05-26`
+ 🛠 重构技术指标模块。
+ 💄 优化方法`formatDate`频繁调用，占用资源过高问题。
+ 💄 优化加载更多触发机制，改为缩放，滚动都会触发。
+ 💄 优化Y轴计算最大值最小值。
+ 🆕 新增方法`addCustomTechnicalIndicator`，用于给图表添加自定义技术指标。
+ 👉 方法`addTechnicalIndicator`变更成`createTechnicalIndicator`。
+ 🗑 去除副图技术指标ohlc绘制。


## 5.2.2
`2020-05-11`
+ 🐞 解决部分浏览器没有`Intl`导致图表无法渲染问题。

## 5.2.1
`2020-05-09`
+ 🐞 修复当主图是分时图，设置`showType: 'rect'`提示文字不显示问题。
+ 🐞 修复当数据只有一条时，x轴不显示时间问题。
+ 🐞 修复当数据变化时，图表不能精准刷新问题。
+ 💄 优化x轴分割计算。
+ 💄 优化`VOL`技术指标图显示。
+ 🆕 `addTechnicalIndicator`方法新增第三个参数，设置技术指标图是否可以拖动调整高度。

## 5.2.0
`2020-04-25`
+ 🐞 修复`setTimezone`方法不能实时生效问题。
+ 🐞 修复调整技术指标图高度时会超出整个图表问题。
+ 💄 优化键盘事件`shift + ↑`和`shift + ↓`灵敏度。
+ 💄 优化默认蜡烛柱的宽度。
+ 💄 优化图表拖拽滚动时鼠标样式。
+ 🆕 `getConvertPictureUrl`方法新增一个参数，用于设置图片的背景色。
+ 🆕 新增方法`setLeftMinVisibleBarCount`，用于设置左边可见的最小bar数量。
+ 🆕 新增方法`setRightMinVisibleBarCount`，用于设置右边可见的最小bar数量。
+ 🆕 样式配置新增字体样式属性。
+ 🆕 新增技术指标最后值展示配置。
+ 🆕 新增技术指标`EMA`。

## 5.1.1
`2020-04-10`
+ 🐞 修复`removeTechnicalIndicator`方法调用无效问题。
+ 🐞 修复在某些特定情况下，图表不能填充根容器问题。
+ 💄 优化蜡烛柱最小宽度。

## 5.1.0
`2020-03-27`
+ 🐞 修复`setStyleOptions`方法调用，不能实时生效问题。
+ 🐞 修复当配置设置`{yAxis: {position: 'left'}}`时，十字光标显示文字不对问题。
+ 💄 优化拖动调整技术指标图高度灵敏度。
+ 🆕 样式配置新增当前技术指标值指示点展示配置。
+ 🆕 样式配置新增百分比y轴配置。

## 5.0.0
`2020-03-25`
+ 🛠 图表整体重构，全新的api，便于拓展功能。
+ 🐞 修复移动端缩放事件响应问题。
+ 💄 优化滚动和缩放流畅度。
+ 🆕 样式配置新增无变化颜色属性`noChangeColor`。
+ 🆕 新增方法`setTimezone`，用于设置图表时区。
+ 🆕 新增方法`setPrecision`，用于设置价格和数量精度。
+ 🆕 技术指标图个数不在受限，可以通过方法`addTechnicalIndicator`去添加。
+ 🆕 技术指标图可以通过拖拽调整高度。

## 4.1.0
`2020-01-19`
+ 🐞 修复当y轴最大值最小值都为0时，显示问题。
+ 💄 优化默认配置虚线参数和分时线颜色。
+ 💄 优化在个别浏览上滚轮滚动时，图表会上下滚动问题。
+ 💄 优化指标计算调用逻辑，减少无用方法调用。

## 4.0.0
`2019-12-30`
+ 🐞 修复`merge`方法，不能正确合并数据问题。
+ 💄 优化默认技术指标图高度。
+ 🆕 新增方法`loadMore`，用于分段加载历史数据。
+ 🆕 新增键盘快捷键`shift + ←`、`shift + →`、`shift + ↑`、`shift + ↓`，用于缩放和滚动。
+ 🆕 新增设置技术指标计算参数功能。
+ 🆕 新增技术指标`SAR`。

## 3.0.0
`2019-12-16`
+ 🆕 支持技术指标。
+ 🆕 支持自定义样式。
+ 🆕 支持移动端。


