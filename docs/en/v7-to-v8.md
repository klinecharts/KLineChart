# From v7 to v8

## UX changes
+ The cross cursor will be displayed when drawing and operating graphics.

## Style configuration is not compatible
+ `candle.tooltip.rect.fillColor` changed to `candle.tooltip.rect.backgroundColor`.
+ `candle.area.fillColor` changed to `candle.area.backgroundColor`.
+ `annotation.symbol.position` changed to `annotation.position`.
+ `annotation.symbol.offset` changed to `annotation.offset`.

## Incompatible API

### Chart API
+ `extension.addTechnicalIndicator(tech)` changed to `extension.addTechnicalIndicatorTemplate(template)`.
+ `extension.addGraphicMark(graphicMark)` changed to `extension.addShapeTemplate(template)`.

### Instance API
+ `createGraphicMark(name, options)` is changed to `createShape(value, paneId)`, the parameters `name` and `options` are combined into one parameter, and the parameter is supported as a string.
+ `addCustomGraphicMark(graphicMark)` changed to `addShapeTemplate(template)`.
+ `getGraphicMark(id)` changed to `getShape(shapeId)`.
+ `setGraphicMarkOptions(options)` changed to `setShapeOptions(options)`.
+ `removeGraphicMark(id)` changed to `removeShape(shapeId)`.
+ `addCustomTechnialIndicator(tech)` changed to `addTechnicalIndicatorTemplate(template)`.
+ `getTechnicalIndicatorByName(name)` changed to `getTechnicalIndicatorTemplate(name)`.
+ `removeAnnotation(points)` changed to `removeAnnotation(paneId, points)`.
+ `removeTag(tagId)` changed to `removeTag(paneId, tagId)`.
+ `scrollToPosition(position, animationDuration)` changed to `scrollToDataIndex(dataIndex, animationDuration)`.
+ `zoomAtPosition(scale, position, animationDuration)` changed to `zoomAtDataIndex(scale, dataIndex, animationDuration)`.
+ `getConvertPictureUrl(includeTooltip, includeGraphicMark, type, backgroundColor)` changed to `getConvertPictureUrl(includeOverlay, type, backgroundColor)`.
+ `subscribeAction(type, callback)` and `unsubscribeAction(type, callback)`, the `type` type removes the `drawCandle` and `drawTechnicalIndicator` types, please use `annotation` or `tag` instead.
+ `convertToPixel({ xAxisValue, yAxisValue }, {paneId, dataIndexXAxis, absoluteYAxis })` changed to `convertToPixel({ timestamp, dataIndex, value }, {paneId, absoluteYAxis })`
+ `convertFromPixel({ x, y }, {paneId, dataIndexXAxis, absoluteYAxis })` changed to `convertFromPixel({ x, y }, {paneId, absoluteYAxis })`.

### Shape API
+ `getRotatePoint(point, targetPoint, angle)` changed to `getRotateCoordinate(coordinate, targetCoordinate, angle)`.
+ `getLinearYFromPoints(point1, point2, targetPoint)` changed to `getLinearYFromCoordinates(coordinate1, coordinate2, targetCoordinate)`.
+ `checkPointOnStraightLine(point1, point2, targetPoint)` changed to `checkCoordinateOnStraightLine(coordinate1, coordinate2, targetCoordinate)`.
+ `checkPointOnRayLine(point1, point2, targetPoint)` changed to `checkCoordinateOnRayLine(coordinate1, coordinate2, targetCoordinate)`.
+ `checkPointOnSegment(point1, point2, targetPoint)` changed to `checkCoordinateOnSegment(coordinate1, coordinate2, targetCoordinate)`.
+ `checkPointOnArc(circleCenterPoint, radius, startAngle, endAngle, targetPoint)` changed to `checkCoordinateOnArc(circleCenterCoordinate, radius, startAngle, endAngle, targetCoordinate)`.
+ `checkPointInCircle(circleCenterPoint, radius, targetPoint)` changed to `checkCoordinateInCircle(circleCenterCoordinate, radius, targetCoordinate)`.
+ `checkPointOnCircle(circleCenterPoint, radius, targetPoint)` changed to `checkCoordinateOnCircle(circleCenterCoordinate, radius, targetCoordinate)`.
+ `checkPointInTriangle(trianglePoints, targetPoint)` changed to `checkCoordinateInTriangle(triangleCoordinates, targetCoordinate)`.
+ `checkPointInDiamond(centerPoint, width, height, targetPoint)` is changed to `checkCoordinateInDiamond(centerCoordinate, width, height, targetCoordinate)`.
+ `checkPointInRect(point1, point2, targetPoint)` changed to `checkCoordinateInRect(coordinate1, coordinate2, targetCoordinate)`.

## Technical indicators are not compatible
Custom technical indicators were renamed to technical indicator templates.
+ Delete the attribute `series`.
+ The attribute `calcParamsAllowDecimal` is merged into `calcParams`, for example: `calcParams` is [5, {value: 10.5, allowDecimal: true }], which means that the second parameter supports decimals.
+ The attribute `baseValue` is merged into `plots`.
+ Change the `color({ preData, currentData, nextData })` in the property `plots` to `color({ prev current, next })`.
+ Method `calcTechnicalIndicator(kLineDataList, calcParams, plots)` parameter changed to `calcTechnicalIndicator(kLineDataList, {params, plots })`.
+ The method `render(ctx, dataSource, viewport, styleOptions, xAxisConvert, yAxisConvert, isCandleTechnicalIndicator)` is changed to `render({ ctx, dataSource, viewport, styles, xAxis, yAxis })`.


## Shapes are not compatible
The custom graphic mark was renamed to graphic template.
+ Method `checkMousePointOn(key, type, points, mousePoint)` changed to `checkEventCoordinateOnShape({ key, type, dataSource, eventCoordinnate})`.
+ The method `createGraphicDataSource(step, tpPoints, xyPoints, viewport, precision, xAxis, yAxis)` is changed to `createShapeDataSource({ step, mode, points, coordinates, viewport, precision, styles, xAxis, yAxis, data })` and returns As a result, `style` is changed to `styles`, and the type is changed to `object`.
+ The method `performMouseMoveForDrawing(step, tpPoints, tpPoint, xAxis, yAxis)` is changed to `performEventMoveForDrawing({ step, mode, points, movePoint, xAxis, yAxis })`.
+ The method `performMousePressedMove(step, tpPoints, tpPoint, xAxis, yAxis)` is changed to `performEventPressedMove({ step, mode, points, pressPointIndex, pressPoint, xAxis, yAxis })`.
+ The method `drawExtend(ctx, graphicDataSources, markOptions, viewport, precision, xAxis, yAxis)` is changed to `drawExtend({ ctx, dataSource, styles, mode, viewport, precision, xAxis, yAxis, data })`.