# 更新日志
## 7.5.0
`2021-06-16`
+ 🆕 新增标签功能，api新增`createTag`和`removeTag`。
+ 🐞 修复删除所有图形标记时，`onRemove`方法不触发问题。
+ 🐞 修复`getConvertPictureUrl`，返回不对问题。
+ 💄 合并`overlay`和`tooltip`。
+ 💄 优化无数据时，y轴显示。
+ 💄 优化移动端十字光标交互。


## 7.3.3
`2021-06-03`
+ 🐞 修复注解回调方法坐标点参数计算不准确问题。
+ 💄 优化y轴显示。


## 7.3.2
`2021-06-01`
+ 👉 默认样式更改为适用于浅色主题。
+ 🐞 修复`technicalIndicator.tooltip.showType: rect`会出错问题。


## 7.3.1
`2021-05-31`
+ 💄 优化`yAxis.type:log`显示。


## 7.3.0
`2021-05-28`
+ 🆕 新增api `scrollByDistance`、`scrollToRealTime`、`scrollToPosition`、`zoomAtCoordinate`和`zoomAtPosition`。
+ 🆕 新增api `setPaneOptions`，用于设置窗口。
+ 🆕 坐标轴新增对数坐标，`yAxis.type: log`。
+ 🆕 新增配置，`candle.priceMark.last.text.borderRadius`、`technicalIndicator.lastValueMark.text.borderRadius`、
  `crosshair.horizontal.text.borderRadius`、`crosshair.vertical.text.borderRadius`。
+ 🆕 新增触摸板滚动支持。
+ 💪 Api `createTechnicalIndicator`，窗口参数可以实时生效。
+ 💪 Api `setDataSpace`和`setOffsetRightSpace`能够实时重绘。


## 7.2.0
`2021-05-20`

❤️️ 520

+ 🆕 新增样式配置`technicalIndicator.tooltip.showType`。
+ 🆕 Api `subscribeAction`新增类型`pane_drag`。
+ 💄 优化窗口拖拽高度调整规则。
+ 🐞 修复面积图显示问题。
+ 🐞 修复注解自定义标记回调参数不对问题。


## 7.1.0
`2021-04-26`
+ 🆕 新增注解功能
  + `createAnnotation`用于添加注解
  + `removeAnnotation`用于删除注解
  + 样式新增`annotation`配置
+ 🆕 新增api，`getGraphicMark`，`getWidth`和`getHeight`，`convertToPixel`和`convertFromPixel`。
+ 🆕 图形标记新增`onMouseEnter`和`onMouseLeave`事件。
+ 🆕 `suscribeAction`新增类型`crosshair`。
+ 🆕 自定义指标技术计算参数支持小数。
+ 💪 增强`unsubscribeAction`，可批量取消事件。
+ 💪 增强`addCustomTechnicalIndicator`和`addCustomGraphicMark`，可批量添加。


## 7.0.2
`2021-04-07`
- 🛠 重写技术指标计算`EMV`, `ROC`, `WR`, `CR`, `PVT`, `DMI`, `MTM`, `PSY`, `VR`, `RSI`, `OBV`, `EMA`, `MACD`, `SMA`, `TRIX`, `CCI`。


## 7.0.1
`2021-03-29`
- 🆕 图形标记新增锁定。
- 💄 `getTechnicalIndicatorByPaneId`新增返回计算结果。
- 💄 技术指标`MACD`的`DIFF`修改为`DIF`。
- 💄 调整`tooltip`显示。
- 🐞 修复技术指标`RSI`调整参数后，显示不对问题。
- 🐞 修复技术指标`VR`计算不对问题，默认计算参数改为[26， 6]。
- 🐞 修复移动端十字光标显示问题。


## 7.0.0
`2021-02-25`

- 🆕 新特性
   - 图表实例方法新增 `removeGraphicMark`， `setGraphicMarkOptions`， `createTechnicalIndicator`。
   - 图表实例方法 `subscribeDrawAction` 和 `unsubscribeDrawAction` 变更为 `subscribeAction` 和 `unsubscribeAction`，并新增类型 `zoom` 和 `scroll`。
   - 图形标记辅助方法新增 `getDistance`， `getRotatePoint`， `checkPointOnArc`， `getRayLine`。
   - 创建技术指标时，如果是新的窗口，可以自定义窗口id。
   - 内置技术指标 `BOLL`，新增计算参数。
   - 创建图形标记时，可自定义id，新增事件回调： `onDrawStart`， `onDrawing`， `onDrawEnd`， `onClick`，`onRightClick`，`onPressedMove`， `onRemove`。
   - 自定义图形标记，新增批量绘制 `conntinuous_line` 和 `polygon`。
- 💪 功能增强
   - 图表实例方法 `removeTechnicalIndicator`，当窗口没有技术指标时，会自动移除窗口。
   - 数据源 `volume`，不再是不必要字段。
   - 自定义图形标记方法 `checkPointOn` 新增参数key。
- 💄 优化
   - 优化检查鼠标点是否在绘图模块上的灵敏度。
   - 优化图形标记渲染。
   - 优化图形标记鼠标操作。
   - 优化十字光标显示。
   - 优化数据更新时技术指标计算。
- 👉 变更
   - 图表实例方法 `setTechnicalIndicatorType` 变更为 `createTechnicalIndicator`。
   - 图表实例方法 `getTechnicalIndicatorInfo` 变更为 `getTechnicalIndicatorByName`。
   - 图表实例方法 `getTechnicalIndicatorType` 变更为 `getTechnicalIndicatorByPaneId`。
   - 图形标记辅助方法 `checkPointOnSegmentLine` 变更为 `checkPointOnSegment`。
   - 快捷键放大变更为 `shift` + `+`。
   - 快捷键缩小变更为 `shift` + `-`。
- 🐞 bug修复
   - 修复内置技术指标 `VOL`，volume提示不显示问题。
   - 修复图形标记点的确定问题。
   - 修复自定义图形比较类型是 `line` 时，可能会报错问题。
   - 修复全局添加图形标记和技术指标，可能报错问题。
- 🗑 废弃
   - 删除图表实例方法 `createPane`， `removePane`， `removeAllGraphicMark`。



## 6.1.0
`2021-01-06`

- 🆕 图表方法新增`extension.addTechnicalIndicator`和`extension.addGraphicMark`。
- 🆕 技术指标`plots`每一项新增`title`。
- 🆕 技术指标新增`styles`。
- 🆕 新增方法`overrideTechnicalIndicator`，取代方法`setTechnicalIndicatorParams`和`setTechnicalIndicatorPrecision`。
- 🆕 新增方法`addCustomGraphicMark`，添加自定义图表标记。
- 🆕 新增方法`removePane`，移除窗口。
- 🆕 新增配置`graphicMark.polygon`和`graphicMark.arc`。
- 👉 方法`getTechnicalIndicatorParams`变更为`getTechnicalIndicatorInfo`。
- 👉 方法`addGraphicMark`变更为`createGraphicMark`。
- 💄 优化`tooltip`显示。
- 🐞 修复方法`dispose`调用可能报错问题。
- 🐞 修复因原型扩展可能与其它插件不兼容问题。
- 🐞 修复typescript引用问题。



## 6.0.5
`2020-12-28`

- 🆕 新增配置`candle.margin`，`candle.tooltip.defaultValue`，`technicalIndicator.margin`，`technicalIndicator.tooltip.defaultValue`和`separator.activeBackgroundColor`。
- 💄 优化拖拽调整图表显示。
- 🐞 修复`candle.tooltip.values`自定义颜色问题。



## 6.0.2
`2020-12-17`

- 💄 优化x轴十字光标时间显示。
- 💄 优化技术指标`plot`类型是`bar`对齐显示。
- 💄 优化蜡烛图最高最低价显示。
- 🐞 修复移动端十字光标首次需要点击两次才消失的问题。



## 6.0.1
`2020-12-06`

- 👉 单条数据最小绘制像素改为1。
- 💄 优化二次填充空数据y轴显示。
- 💄 优化部分内置技术指标计算。
- 🐞 修复一样的数据可能导致y轴刻度无法计算的问题。



## 6.0.0
`2020-11-29`

- 🎨 全新的样式配置
   - 👉 所有`display`变更为`show`。
   - 👉 `candelStick`变更为`candle`。
   - 👉 `candleStick.bar.style`变更为`candle.type`。
   - 👉 `realTime`变更为`candle.area`。
   - 👉 `floatLayer.prompt.candleStick`变更为`candle.tooltip`。
   - 👉 `floatLayer.prompt.technicalIndicator`变更为`technicalIndicator.tooltip`。
   - 👉 `floatLayer.crossHair`变更为`crosshair`。
- 🔧 全新的API
   - 👉 `createTechnicalIndicator`变更为`createPane`。
   - 👉 `setPrecision`变更为`setPriceVolumePrecision`。
   - 💪 `setTechnicalIndicatorType`和`removeTechnicalIndicator`新增参数，增强功能。
   - 🆕 新增`getTechnicalIndicatorType`。
   - 🗑 删除`setCandleStickChartType`。
   - 🗑 删除`setCandleStickTechnicalIndicatorType`。
- 🆕 主图和附图支持设置多个技术指标类型。
- 💄 优化初始化方法`init`错误参数提示。
- 🐞 修复技术指标提示名字和值之间的间隙不对问题。



## 5.7.0
`2020-11-13`

- 🛠 重构标记图形模块。
- 🆕 配置项`realTime.timeLine.areaFillColor`支持渐变。
- 🆕 `subscribeDrawAction`方法回调参数`data`里新增`dataIndex`。
- 🆕 新增方法`setZoomEnabled`和`isZoomEnabled`，`setScrollEnabled`和`isScrollEnabled`。
- 💄 优化y轴数值很小时图表显示。



## 5.6.0
`2020-08-29`

- 🆕 自定义技术指标新增`render`属性。
- 🆕 自定义指标方法`calcTechnicalIndicator`，增加参数`plots`。
- 🆕 配置项新增`xAxis.height`和`yAxis.width`。
- 🆕 新增方法`subscribeDrawAction`和`unsubscribeDrawAction`，用于绘制监听和取消。
- 🆕 新增方法`getTimezone`。
- 👉 方法`getTechnicalIndicatorParamOptions`变更为`getTechnicalIndicatorParams`。
- 👉 内置指标文字提示显示`xxxMa`变更为`maXxx`。
- 🗑 去除配置项`floatLayer.prompt.technicalIndicator.point`。



## 5.5.1
`2020-08-16`

- 💄 优化无数据时，y轴显示。
- 💄 优化默认主图技术指标类型，默认图表更纯粹。
- 💄 优化性能，减少无用的计算。
- 🐞 修复切换图表类型和新增副图指标y轴不能显示和显示不对问题。
- 🐞 修复当配置是方法时，不能正确合并的问题。
- 👉 `xAxis.tickText.margin`变更为`xAxis.tickText.paddingTop`和`xAxis.tickText.paddingBottom`。
- 👉 `yAxis.tickText.margin`变更为`yAxis.tickText.paddingLeft`和`yAxis.tickText.paddingRight`。



## 5.5.0
`2020-07-26`

- 🆕 重新加回技术指标ohlc显示。
- 🆕 新增文字`weight`配置。
- 🆕 自定义技术指标新增`shouldFormatBigNumber`属性，用于告知图表是否需要格式化比较大的数字。
- 🆕 新增方法`setTechnicalIndicatorPrecision`。
- 💄 优化鼠标移开图表后，提示数据展示，改为展示最后一条数据。
- 💄 优化加载新数据时，图表绘制起始位置。
- 💄 优化内部dom元素层级，减少嵌套。
- 💄 优化`VOL`技术指标提示文字显示。
- 🐞 修复不合法的技术指标计算参数，可能会导致图表崩溃的问题。
- 👉 样式配置`yAxis.tickText.position`变更为`yAxis.inside`。
- 👉 默认字体配置由`Arial`变更为`Helvetica Neue`。
- 👉 自定义技术指标属性`isPriceTechnicalIndicator`变为`series`，值变更为`price`、`volume`和`normal`。
- 🗑 去除横坐标轴`minHeight`和`maxHeight`配置，改为高度自适应。
- 🗑 去除纵坐标轴`minWidth`和`maxWidth`配置，改为宽度自适应。



## 5.3.0
`2020-05-26`

- 🛠 重构技术指标模块。
- 💄 优化方法`formatDate`频繁调用，占用资源过高问题。
- 💄 优化加载更多触发机制，改为缩放，滚动都会触发。
- 💄 优化Y轴计算最大值最小值。
- 🆕 新增方法`addCustomTechnicalIndicator`，用于给图表添加自定义技术指标。
- 👉 方法`addTechnicalIndicator`变更成`createTechnicalIndicator`。
- 🗑 去除副图技术指标ohlc绘制。



## 5.2.2
`2020-05-11`

- 🐞 解决部分浏览器没有`Intl`导致图表无法渲染问题。



## 5.2.1
`2020-05-09`

- 🐞 修复当主图是分时图，设置`showType: 'rect'`提示文字不显示问题。
- 🐞 修复当数据只有一条时，x轴不显示时间问题。
- 🐞 修复当数据变化时，图表不能精准刷新问题。
- 💄 优化x轴分割计算。
- 💄 优化`VOL`技术指标图显示。
- 🆕 `addTechnicalIndicator`方法新增第三个参数，设置技术指标图是否可以拖动调整高度。



## 5.2.0
`2020-04-25`

- 🐞 修复`setTimezone`方法不能实时生效问题。
- 🐞 修复调整技术指标图高度时会超出整个图表问题。
- 💄 优化键盘事件`shift + ↑`和`shift + ↓`灵敏度。
- 💄 优化默认蜡烛柱的宽度。
- 💄 优化图表拖拽滚动时鼠标样式。
- 🆕 `getConvertPictureUrl`方法新增一个参数，用于设置图片的背景色。
- 🆕 新增方法`setLeftMinVisibleBarCount`，用于设置左边可见的最小bar数量。
- 🆕 新增方法`setRightMinVisibleBarCount`，用于设置右边可见的最小bar数量。
- 🆕 样式配置新增字体样式属性。
- 🆕 新增技术指标最后值展示配置。
- 🆕 新增技术指标`EMA`。



## 5.1.1
`2020-04-10`

- 🐞 修复`removeTechnicalIndicator`方法调用无效问题。
- 🐞 修复在某些特定情况下，图表不能填充根容器问题。
- 💄 优化蜡烛柱最小宽度。



## 5.1.0
`2020-03-27`

- 🐞 修复`setStyleOptions`方法调用，不能实时生效问题。
- 🐞 修复当配置设置`{yAxis: {position: 'left'}}`时，十字光标显示文字不对问题。
- 💄 优化拖动调整技术指标图高度灵敏度。
- 🆕 样式配置新增当前技术指标值指示点展示配置。
- 🆕 样式配置新增百分比y轴配置。



## 5.0.0
`2020-03-25`

- 🛠 图表整体重构，全新的api，便于拓展功能。
- 🐞 修复移动端缩放事件响应问题。
- 💄 优化滚动和缩放流畅度。
- 🆕 样式配置新增无变化颜色属性`noChangeColor`。
- 🆕 新增方法`setTimezone`，用于设置图表时区。
- 🆕 新增方法`setPrecision`，用于设置价格和数量精度。
- 🆕 技术指标图个数不在受限，可以通过方法`addTechnicalIndicator`去添加。
- 🆕 技术指标图可以通过拖拽调整高度。



## 4.1.0
`2020-01-19`

- 🐞 修复当y轴最大值最小值都为0时，显示问题。
- 💄 优化默认配置虚线参数和分时线颜色。
- 💄 优化在个别浏览上滚轮滚动时，图表会上下滚动问题。
- 💄 优化指标计算调用逻辑，减少无用方法调用。



## 4.0.0
`2019-12-30`

- 🐞 修复`merge`方法，不能正确合并数据问题。
- 💄 优化默认技术指标图高度。
- 🆕 新增方法`loadMore`，用于分段加载历史数据。
- 🆕 新增键盘快捷键`shift + ←`、`shift + →`、`shift + ↑`、`shift + ↓`，用于缩放和滚动。
- 🆕 新增设置技术指标计算参数功能。
- 🆕 新增技术指标`SAR`。



## 3.0.0
`2019-12-16`

- 🆕 支持技术指标。
- 🆕 支持自定义样式。
- 🆕 支持移动端。
