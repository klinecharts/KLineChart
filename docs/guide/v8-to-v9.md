# 🛠️ 从 V8 到 V9
本文档将帮助你从 klinecharts 8.x 版本升级到 klinecharts 9.x 版本，如果你是 7.x 或者更老的版本，请先参考之前的升级文档升级到 8.x。

## 引入调整
不再区分`klinecharts/index.blank`和`klinecharts/index.simple`，请统一使用`import { ... } from 'klinecharts'`。

## 设计调整
`shape`，`annotation`，`tag`合并成`overlay`，详情请查阅[覆盖物](./overlay.md)。

## 样式配置调整
+ 所有线的样式选项`dash`，更改为`dashed`，`dashValue`更改为`dashedValue`。
+ `candle.tooltip.labels`和`candle.tooltip.values`，合并为`candle.tooltip.custom`。
+ `xAxis.height`变更为`xAxis.size`，`xAxis.tickText.paddingTop`变更为`xAxis.tickText.marginStart`，`xAxis.tickText.paddingBottom`变更为`xAxis.tickText.marginEnd`。
+ `yAxis.height`变更为`yAxis.size`，`yAxis.tickText.paddingTop`变更为`yAxis.tickText.marginStart`，`yAxis.tickText.paddingBottom`变更为`yAxis.tickText.marginEnd`。
+ `technicalIndicator.bar`变更为`indicator.bars`，`technicalIndicator.line`变更为`indicator.lines`，`technicalIndicator.circle`变更为`indicator.circles`。
+ 删除`shape`，`annotation`，`tag`，请用`overlay`代替。

## API调整

### 图表API
+ `extension.addTechnicalIndicatorTemplate(template)`变更为`registerIndicator(template)`。
+ 删除`extension.addShapeTemplate(template)`，请用`registerOverlay(template)`代替。

### 实例API
+ `getDom({ paneId, position })`变更为`getDom(paneId, position)`，参数`position`选项变更为`root`，`main`和`yAxis`。
+ `getWidth()`和`getHeight()`合并成一个方法`getSize(paneId, position)`。
+ `setStyleOptions(styles)`变更为`setStyles(styles)`。
+ `getStyleOptions()`变更为`getStyles()`。
+ `setOffsetRightSpace(space)`变更为`setOffsetRightDistance(distance)`
+ `createTechnicalIndicator(value, isStack, paneOptions)`变更为`createIndicator(value, isStack, paneOptions)`
+ `overrideTechnicalIndicator(override, paneId)`变更为`overrideIndicator(override, paneId)`。
+ `getTechnicalIndicatorByPaneId(paneId, name)`变更为`getIndicatorByPaneId(paneId, name)`。
+ `removeTechnicalIndicator(paneId, name)`变更为`removeIndicator(paneId, name)`。
+ `subscribeAction(type, callback)`和`unsubscribeAction(type, callback)`，参数`type`选项变更为`onZoom`，`onScroll`，`onCrosshairChange`，`onVisibleRangeChange`和`onPaneDrag`。
+ `convertToPixel(value, finder)`和`convertFromPixel(coordinate, finder)`，参数`finder.absoluteYAxis`变更为`finder.absolute`。
+ 删除`createShape(value, paneId)`，`createAnnotation(annotation, paneId)`，`createTag(tag, paneId)`，请用`createOverlay(value, paneId)`代替。
+ 删除`removeShape(id)`，`removeAnnotation(paneId, points)`，`removeTag(paneId, tagId)`，请用`removeOverlay(id)`代替。
+ 删除`setShapeOptions(options)`，请用`overrideOverlay(override)`代替。
+ 删除`createHtml(html, paneId)`，`removeHtml(paneId, htmlId)`，请通过`getDom(paneId, position)`获取到对应的dom后操作。
+ 删除`getTechnicalIndicatorByPaneId(paneId, name)`。


### 图形辅助API
+ 所有的API都迁移至`klinecharts.utils`。

## 自定义技术指标调整
+ 属性`plots`变更为`figures`，子项方法`color`，`isStroke`，`isDashed`合并成`styles`。
+ 方法`regeneratePlots(params)`变更为`regenerateFigures(params)`。
+ 方法`calcTechnicalIndicator(kLineDataList, options)`变更为`calc(kLineDataList, indicator)`。
+ 方法`createTooltipDataSource({ dataSource, viewport, crosshair, technicalIndicator, xAxis,yAxis, defaultStyles })`变更为`createTooltipDataSource({ kLineDataList, indicator, visibleRange, bounding, crosshair, defaultStyles, xAxis, yAxis })`，返回值由`[{ title: 'xxx', value: 'xxx', color: 'xxx' }, ...]`变更为`{ name: 'xxx', calcParamsText: 'xxx', values: [{ title: 'xxx', value: 'xxx', color: 'xxx' }, ...] }`。
+ 方法`render({ ctx, dataSource, viewport, styles,xAxis, yAxis })`变更为`draw({ ctx, kLineDataList, indicator, visibleRange, bounding, barSpace, defaultStyles, xAxis, yAxis })`。
+ 删除属性`shouldCheckParamCount`。
