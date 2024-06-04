# 🛠️ From V8 to V9
This document will help you upgrade from kinecharts 8.x to klinecharts 9.x. If you are 7.x or older, please refer to the previous upgrade document to upgrade to 8.x.

## Import adjustment
`klinecharts/index.blank'` and `klinecharts/index.simple` are no longer distinguished. Please use `import {...} from klinecharts` uniformly.

## Design adjustment
`shape`, `annotation`, `tag` are merged into `overlay`. Please refer to [overlay](./overlay.md) for details.

## Style configuration adjustment
+ The style options of all lines are changed to `dashed` and `dashValue` to `dashedValue`.
+ `candle.tooltip.labels` and `candle.tooltip.values` are merged into `candle.tooltip.custom`.
+ `xAxis.height` is changed to `xAxis.size`, `xAxis.tickeText.paddingTop` is changed to `xAxis.tickeText.marinStart`, and `xAxis.tickeText.paddingBottom` is changed to `xAxis.tickeText.marginEnd`.
+ `yAxis.height` is changed to `yAxis.size`, `yAxis.tickeText.paddingTop` is changed to `yAxis.tickeText.marinStart`, and `yAxis.tickeText.paddingBottom` is changed to `yAxis.tickeText.marginEnd`.
+ `technicalIndicator.bar` is changed to `indicator.bars`, `technicalIndicator.line` is changed to `indicator.lines`，`technicalIndicator.circle` is changed to `indicator.circles`.
+ Delete `shape`, `annotation`, `tag`, please use `overlay` instead.

## API adjustment
### Chart API
+ `extension.addTechnicalIndicatorTemplate(template)` is changed to `registerIndicator(template)`.
+ Delete `extension.addShapeTemplate(template)`, please use `registerOverlay(template)` instead.

### Instance API
+ `getDom({paneId, position})` is changed to `getDom(paneId, position)`, and the parameter `position` option is changed to `root`, `main` and `yAxis`.
+ `getWidth()` and `getHeight()` are combined into a method '`getSize(paneId, position)`.
+ `setStyleOptions(styles)` is changed to `setStyles(styles)`.
+ `getStyleOptions()` is changed to `getStyles()`.
+ `setOffsetRightSpace(space)` is changed to `setOffsetRightDistance(distance)`.
+ `createTechnicalIndicator(value, isStack, paneOptions)` is changed to `createIndicator(value, isStack, paneOptions)`.
+ `overrideTechnicalIndicator(override, paneId)` is changed to `overrideIndicator(override, paneId)`.
+ `getTechnicalIndicatorByPaneId(paneId, name)` is changed to `getIndicatorByPaneId(paneId, name)`.
+ `removeTechnicalIndicator(paneId, name)` is changed to `removeIndicator(paneId, name)`.
+ `subscribeAction(type, callback)` and `unsubscribeAction(type, callback)`. The parameter `type` option is changed to ` onZoom`, `onScroll`, `onCrosshairChange`, `onVisibleRangeChange` and `onPaneDrag`.
+ `convertToPixel(value, finder)` and `convertFromPixel(coordinate, finder)`, the parameter `finder.absoluteYAxis` is changed to `finder.absolute`.
+ To delete `createShape(value, paneId)`, `createAnnotation(annotation, paneId)`, `createTag(tag, paneId)`, please use `createOverlay(value, paneId)` instead.
+ To delete `removeShape(id)`, `removeAnnotation(paneId, points)`, `removeTag(paneId, tagId)`, please use `removeOverlay(id)` instead.
+ To delete `setShapeOptions(options)`, use `overrideOverlay(override)` instead.
+ To delete `createHtml(html, paneId)`, `removeHtml(paneId, htmlId)`, please obtain the corresponding dom through `getDom(paneId, position)`.
+ To delete `getTechnicalIndicatorByPaneId(paneId, name)`.

### Shape help API
+ All APIs are migrated to 'klinecharts.utils'.

## Customized technical indicator adjustment
+ Attribute `plots` is changed to `figures`, sub item methods `color`, `isStroke`, `isDashed` are merged into `styles`.
+ Change the method '`regeneratePlots(params)` to `regenerateFigures(params)`.
+ The method `calcTechnicalIndicator(kLineDataList, options)` is changed to `calc(kLineDataList, indicator)`.
+ The method `createTooltipDataSource({ dataSource, viewport, crosshair, technicalIndicator, xAxis, yAxis, defaultStyles })` is changed to `createTooltipDataSource({ kLineDataList, indicator, visibleRange, bounding, crosshair, defaultStyles, xAxis, yAxis })`. The return value is determined by `[{ title: 'xxx', value: 'xxx', color: 'xxx' } ]` Change to `{ name: 'xxx', calcParamsText: 'xxx', values: [{ title: 'xxx', value: 'xxx', color: 'xxx' }, ...] }`.
+ The method `render({ctx, dataSource, viewport, styles, xAxis, yAxis})` is changed to `draw({ ctx, kLineDataList, indicator, visibleRange, bounding, barSpace, defaultStyles, xAxis, yAxis })`.
+ Delete the attribute `shouldCheckParamCount`.