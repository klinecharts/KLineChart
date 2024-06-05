# 📠 更新日志

## 9.8.10
`2024-06-06`
+ 🐞 修复基础图形 `rect`, `line` 绘制模糊问题。
+ 🐞 修复实例方法 `zoomAtCoordinate`、`zoomAtDataIndex` 和 `zoomAtTimestamp`，缩放不准确问题。
+ 🐞 修复x轴缩放可能出错问题。
+ 💄 优化实例方法 `subscribeAction`，当 `type` 是 'onScroll' 和 'onZoom' 时，回调方法新增参数。
+ 💄 优化指标属性 `figures` 中的子项 `attrs`，新增回调参数 `data`。

## 9.8.9
`2024-05-28`
+ 🐞 修复样式配置 `yAxis.type: 'percentage'` 错误。
+ 🐞 修复 typescript 中声明问题。

## 9.8.8
`2024-05-14`
+ 🐞 修复样式配置 `candle.tooltip.custom` 是数组时无法覆盖问题。
+ 🐞 修复小数折叠不准确问题。
+ 💄 优化覆盖物回调方法中的参数 `precision` 。

## 9.8.7
`2024-05-10`
+ 🐞 修复指标精度不同步价格数量精度问题。

## 9.8.6
`2024-05-07`
+ 🐞 修复图表API `registerIndicator` 和 `registerOverlay` 参数 `extendData` 无法生效问题。
+ 🐞 修复千分符指定 `.` 时，导致小数折叠不对问题。
+ 🐞 修复创建覆盖物后，可以无法拖动问题。

## 9.8.5
`2024-04-14`
+ 💄 优化图表默认右偏移距离。
+ 🐞 修复面积图显示问题。
+ 🐞 修复图表偶发会空白问题。

## 9.8.3
`2024-04-12`
+ 💄 优化样式，`candle.tooltip` 和 `indicator.tooltip` 新增 `offsetLeft`，`offsetTop`，`offsetRight`，`offsetBottom`。
+ 💄 优化基础图形，图形属性支持数组。
+ 💄 优化y轴渲染。
+ 💄 优化默认显示，蜡烛柱默认宽度改为8。
+ 🐞 修复 `applyMoreData` 添加重复数据问题。[@cryptotooltop](https://github.com/cryptotooltop)

## 9.8.2
`2024-03-26`
+ 💄 优化面积图显示。
+ 💄 优化平滑曲线绘制。
+ 🐞 修复覆盖物绘制到未来时间，可能不对问题。

## 9.8.1
`2024-03-13`
+ 🐞 修复初始化`layout`只指定`xAxis`时，导致图表无法初始化问题。
+ 🐞 修复内置指标`VOL`修改`calcParams`时出错问题。
+ 💄 优化y轴小数折叠显示时计算的宽度准确度。
+ 💄 优化滚轮事件触发。

## 9.8.0
`2024-03-04`
+ 🆕 支持自定义坐标轴。
+ 🆕 支持指标绘制到未来时间。
+ 🆕 支持长小数折叠。
+ 🆕 支持向前和向后添加数据。
+ 🐞 修复不同浏览器格式化时间问题。

## 9.7.2
`2024-01-12`
+ 🐞 修复指标属性 `minValue` 和 `maxValue` 不生效问题。
+ 🐞 修复覆盖物x轴上显示问题。
+ 💄 优化样式 `candle.type: 'ohlc'` 显示。
+ 💄 优化绘制清晰度。

## 9.7.1
`2023-12-18`
+ 🐞 修复指标和覆盖物方法不执行问题。
+ 🐞 修复包管理器下载node版本依赖问题。

## 9.7.0
`2023-12-12`
+ 🆕 实例方法新增`setMaxOffsetLeftDistance`和`setMaxOffsetRightDistance`。
+ 🆕 指标新增`zLevel`属性。
+ 💄 优化`ohlc`蜡烛柱渲染。
+ 🐞 修复蜡烛柱模糊问题。
+ 🐞 修复覆盖物`zLevel`渲染规则。

## 9.6.0
`2023-11-14`
+ 🖋️ 重构窗口之间的分割线模块。
+ 🆕 图表方法`init(ds, options)`，参数`options`新增`layout`。
+ 🆕 实例方法`createIndicator(value, isStack, paneOptions, callback)`，参数`paneOptions`新增`position`。
+ 🆕 样式`candle.tooltip.custom`新增`turnover`字符串模版。
+ 💄 优化样式`overlay.text`配置。
+ 💄 优化`utils.clone`和`utils.merge`实现。
+ 🐞 修复多个覆盖物样式显示不对问题。
+ 🐞 修复多个指标样式显示不对问题。


## 9.5.4
`2023-09-22`
+ 🐞 修复样式`candle.type`是`area`时，最新价线不显示问题。
+ 🐞 修复样式`crosshair.vertical.text.paddingLeft`显示不对问题。

## 9.5.3
`2023-09-19`
+ 🐞 修复ts下引入问题。

## 9.5.2
`2023-09-18`
+ 💄 优化基础图形`text`。
+ 💄 优化内置覆盖物`simpleAnnotation`和`simpleTag`。
+ 💄 优化技术指标自由样式，支持增量。
+ 🐞 修复typescript声明问题。

## 9.5.1
`2023-08-14`
+ 🆕 图表方法新增`getOverlayClass`。
+ 🆕 样式配置`candle.tooltip.custom`新增内置涨跌幅支持。
+ 💄 优化基础图形`rect`事件响应。
+ ↩️ 分割线事件响应回退


## 9.5.0
`2023-06-15`
+ 🆕 `Overlay`新增事件`onDoubleClick`，新增属性`modeSensitivity`。
+ 🆕 样式配置`candle.tooltip.custom`支持字符串模版。
+ 🐞 优化移动端阻尼滚动掉帧问题。
+ 🐞 修复窗口id命名拼写错误。
+ 💄 优化分割线事件响应灵敏度。
+ 💄 优化typescript下，OverlayFigure中的attrs类型声明。


## 9.4.0
`2023-05-25`
+ 🆕 实例api `createOverlay` 支持数组。
+ 🆕 `overlay`新增属性`paneId`，`defaultZLevel`和`zLevel`。
+ 🆕 `xAxis`新增方法`convertTimestampFromPixel`和`convertTimestampToPixel`。
+ 💄 优化蜡烛柱显示。

## 9.3.0
`2023-05-13`
+ 🆕 新增图表API `utils.calcTextWidth`。
+ 🆕 图表API `createIndicator(value, isStack, options)`和`setPaneOptions(options)`新增`options.axisOptions`。
+ 🆕 指标图形配置支持自定义。
+ 💄 优化bar宽度比例。
+ 💄 优化内部获取屏幕像素比。
+ 💄 优化内部id生成。


## 9.2.2
`2023-05-04`
+ 🐞 修复基础图形`line`事件检查可能导致错误问题。
+ 💄 优化类型检查。


## 9.2.1
`2023-04-27`
+ 💄 优化默认样式，`#EF5350`变更为`#F92855`，`#26A69A`变更为`#2DC08E`。
+ 💄 优化typescript声明。

## 9.2.0
`2023-04-24`
+ 🆕 实例API新增`getOffsetRightDistance`和`executeAction`。
+ 🆕 实例API`applyNewData`、`applyMoreData`和`updateData`新增成功回调入参`callback`。
+ 🆕 支持千分符显示。
+ 🆕 样式配置新增`candle.bar.upBorderColor`、`candle.bar.downBorderColor`、`candle.bar.noChangeBorderColor`、`candle.bar.upWickColor`、`candle.bar.downWickColor`、`candle.bar.noChangeWickColor`、`candle.tooltip.rect.position`和`candle.tooltip.rect.offsetBottom`。
+ 🆕 所有`visibleRange`新增`realFrom`和`realTo`。
+ 💄 优化API，`klinecharts.utils.isValid`和`klinecharts.utils.formatBigNumber`。
+ 💄 优化开发环境下，日志输出。

## 9.1.3
`2023-04-15`
+ 🐞 修复图表api `applyNewData` 入参是空数组时不刷新问题。
+ 🐞 修复无数据时y轴上十字光标文字不显示问题。
+ 💄 优化面积图显示。
+ 💄 优化覆盖物事件回调参数，新增`figureKey`和`figureIndex`。
+ 💄 优化typescript覆盖物样式类型，和基础类型`DeepPartial`, `DeepRequired`。

## 9.1.2
`2023-04-10`
+ 🐞 修复内置基础图形`line`触发事件不准确问题。
+ 🐞 修复内置覆盖物`simpleAnnotation`和`simpleTag`绘制完成后第一次触发事件问题。
+ 💄 优化覆盖物图形事件忽略，支持事件选择。

## 9.1.1
`2023-03-14`
+ 🐞 修复内置基础图形`arc`不生效问题。
+ 💄 优化渲染更新。

## 9.1.0
`2023-02-23`
+ 🆕 图表实例方法`subscribeAction`和`unsubscribeAction`类型新增`onCandleBarClick`。
+ 🆕 覆盖物支持双击强制结束绘制。
+ 💄 优化事件处理。

## 9.0.1
`2023-02-17`
+ 🐞 修复typescript引入问题。

## 9.0.0
`2023-02-16`
+ 🛠 Typescript重构。
+ 🆕 新特性
   + 新增Y轴方向缩放，滚动。
   + API
     + 新增基图表方法`registerFigure`，`getSupportFigures`，`getFigureClass`，`rigisterOverlay`，`getSupportOverlays`，`registerLocale`，`getSupportLocales`，`registerStyles`。
     + 新增实例方法，`getSize`，`setLocale`，`getLocal`，`setCustomApi`，`getVisibleRange`，`createOverlay`，`getOverlayById`，`overrideOverlay`，`removeOverlay`。
   + 样式配置
     + 新增`candle.priceMark.last.text.borderStyle`，`candle.tooltip.icons`，`indicator.lastValueMark.text.borderStyle`，`indicator.tooltip.icons`，`crosshair.horizontal.text.borderStyle`，`crosshair.vertical.text.borderStyle`。
+ 👉 变更
   + API
     + 图表方法`extension.addTechnicalIndicatorTemplate`变更为`registerIndicator`。
     + 图表方法`extension.addShapeTemplate`变更为`registerOverlay`。
     + 实例方法`setStyleOptions`变更为`setStyles`。
     + 实例方法`getStyleOptions`变更为`getStyles`。
     + 实例方法`setPaneOptions(options)`，`options`新增属性`gap`。
     + 实例方法`setOffsetRightSpace`变更为`setOffsetRightDistance`。
     + 实例方法`createTechnicalIndicator`变更为`createIndicator`。
     + 实例方法`overlayTechnicalIndicator`变更为`overlayIndicator`。
     + 实例方法`getTechnicalIndicatorByPaneId`变更为`getIndicatorByPaneId`。
     + 实例方法`removeTechnicalIndicator`变更为`removeIndicator`。
   + 样式配置
     + 所有`line.style`选项变更为`solid`和`dashed`。
     + 所有`dashValue`变更为`dashedValue`。
     + `xAxis.height`变更为`xAxis.size`，`xAxis.tickText.paddingTop`变更为`xAxis.tickText.marginStart`，`xAxis.tickText.paddingBottom`变更为`xAxis.tickText.marginEnd`。
     + `yAxis.height`变更为`yAxis.size`，`yAxis.tickText.paddingTop`变更为`yAxis.tickText.marginStart`，`yAxis.tickText.paddingBottom`变更为`yAxis.tickText.marginEnd`。
     + `technicalIndicator.bar`变更为`indicator.bars`，`technicalIndicator.line`变更为`indicator.lines`，`technicalIndicator.circle`变更为`indicator.circles`。
   + 自定义扩展
      + 技术指标属性`calcParams`，变更为支持任意类型。
      + 技术指标属性`plots`变更为`figures`。
      + 技术指标属性`regeneratePlots`变更为`regeneratefigures`。
      + 技术指标属性`calcTechnicalIndicator`变更为`calc`。
      + 技术指标属性`render`变更为`draw`。
+ 🗑 废弃
   + API
      + 删除实例方法`getWidth`，`getHeight`，改用`getSize`。
      + 删除实例方法`createShape`，`createAnnotation`，`createTag`，改用`createOverlay`。
      + 删除实例方法`removeShape`，`removeAnnotation`，`removeTag`，改用`removeOverlay`。
      + 删除实例方法`setShapeOptions`，改用`overrideOverlay`。
      + 删除实例方法`createHtml`，`removeHtml`，`addTechnicalIndicatorTemplate`，`getTechnicalIndicatorTemplate`，`addShapeTemplate`。
   + 样式配置
      + 删除`shape`，`annotation`，`tag`，改用`overlay`。
      + 删除`candle.margin`，`technicalIndicator.margin`。
   + 自定义扩展
      + 技术指标模版不再保存相关属性。
      + 技术指标删除属性`shouldCheckParamCount`。
      + 删除`Shape`，改用`Overlay`。


## 8.x

去[Github](https://github.com/liihuu/KLineChart/blob/v8.6.3/docs/zh-CN/changelog.md)上查看 8.x 的 Change Log。


## 7.x

去[Github](https://github.com/liihuu/KLineChart/blob/v7.5.0/docs/zh-CN/changelog.md)上查看 7.x 的 Change Log。

## 6.x

去[Github](https://github.com/liihuu/KLineChart/blob/v6.1.0/docs/zh-CN/CHANGELOG.md)上查看 6.x 的 Change Log。

## 5.x

去[Github](https://github.com/liihuu/KLineChart/releases/tag/v5.0.0)上查看 5.x 的版本记录。

## 4.x

去[Github](https://github.com/liihuu/KLineChart/releases/tag/v4.0.0)上查看 4.x 的版本记录。
