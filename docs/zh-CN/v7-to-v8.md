# 从v7到v8

## 样式配置不兼容
+ `candle.tooltip.rect.fillColor`变更为`candle.tooltip.rect.backgroundColor`。
+ `candle.area.fillColor`变更为`candle.area.backgroundColor`。
+ `annotation.symbol.position`变更为`annotation.position`。 
+ `annotation.symbol.offset`变更为`annotation.offset`。

## 不兼容的API

### 图表API
+ `extension.addTechnicalIndicator(tech)`变更为`extension.addTechnicalIndicatorTemplate(template)`。
+ `extension.addGraphicMark(graphicMark)`变更为`extension.addGraphicMarkTemplate(template)`。

### 实例API
+ `createGraphicMark(name, options)`变更为`createGraphicMark(value)`，参数`name`和`options`合并为一个参数，同时支持参数为字符串。
+ `addCustomTechnialIndicator(tech)`变更为`addTechnicalIndicatorTemplate(template)`。
+ `addCustomGraphicMark(graphicMark)`变更为`addGraphicMarkTemplate(template)`。
+ `getTechnicalIndicatorByName(name)`变更为`getTechnicalIndicatorTemplate(name)`。
+ `removeAnnotation(points)`变更为`removeAnnotation(paneId, points)`。
+ `removeTag(tagId)`变更为`removeTag(paneId, tagId)`。
+ `scrollToPosition(position, animationDuration)`变更为`scrollToDataIndex(dataIndex, animationDuration)`。
+ `zoomAtPosition(scale, position, animationDuration)`变更为`zoomAtDataIndex(scale, dataIndex, animationDuration)`。
+ `getConvertPictureUrl(includeTooltip, includeGraphicMark, type, backgroundColor)`变更为`getConvertPictureUrl(includeOverlay, type, backgroundColor)`。
+ `subscribeAction(type, callback)`和`unsubscribeAction(type, callback)`，`type`类型去除`drawCandle`和`drawTechnicalIndicator`类型，请用`annotation`或者`tag`代替。
+ `convertToPixel({ xAxisValue, yAxisValue }, { paneId, dataIndexXAxis, absoluteYAxis })`变更为`convertToPixel({ timestamp, dataIndex, value }, { paneId, absoluteYAxis })`
+ `convertFromPixel({ x, y }, { paneId, dataIndexXAxis, absoluteYAxis })`变更为`convertFromPixel({ x, y }, { paneId, absoluteYAxis })`。

## 技术指标不兼容
自定义技术指标更名为技术指标模板。
+ 去除属性`series`。
+ 属性`calcParamsAllowDecimal`合并到`calcParams`，例如：`calcParams`为[5, { value: 10.5, allowDecimal: true }]，代表第二个参数支持小数。
+ 属性`baseValue`合并到`plots`。
+ 属性`plots`里面的`color({ preData, currentData, nextData })`变更为`color({ prev current, next })`。
+ 方法`calcTechnicalIndicator(kLineDataList, calcParams, plots)`参数变更为`calcTechnicalIndicator(kLineDataList, { params, plots })`。
+ 方法`render(ctx, dataSource, viewport, styleOptions, xAxisConvert, yAxisConvert, isCandleTechnicalIndicator)`变更为`render({ ctx, dataSource, viewport, styles, xAxis, yAxis})`。


## 图形标记不兼容
自定义图形标记更名为图形标记模板。
+ 方法`checkMousePointOn(key, type, points, mousePoint)`变更为`checkEventCoordinateOnGraphic({ key, type, dataSource, eventCoordinnate})`。
+ 方法`createGraphicDataSource(step, tpPoints, xyPoints, viewport, precision, xAxis, yAxis)`变更为`createGraphicDataSource({ step, points, coordinates, viewport, precision, xAxis, yAxis })`。
+ 方法`performMouseMoveForDrawing(step, tpPoints, tpPoint, xAxis, yAxis)`变更为`performEventMoveForDrawing({ step, mode, points, movePoint, xAxis, yAxis })`。
+ 方法`performMousePressedMove(step, tpPoints, tpPoint, xAxis, yAxis)`变更为`performEventPressedMove({ mode, points, pressPointIndex, pressPoint, xAxis, yAxis })`，。
+ 方法`drawExtend(ctx, graphicDataSources, markOptions, viewport, precision, xAxis, yAxis)`变更为`drawExtend({ ctx, dataSource, styles, viewport, precision, xAxis, yAxis })`。