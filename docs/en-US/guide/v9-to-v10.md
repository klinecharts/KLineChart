# 🛠️ From 9.x to 10.x
This document will help you upgrade from klinecharts version 9.x to klinecharts version 10.x. If you are using version 8.x or older, please refer to [v8 to v9](https://v9.klinecharts.com/en-US/guide/v8-to-v9) to upgrade to 9.x first.

## Style configuration adjustment
+ Remove `yAxis.position` , `yAxis.type` , `yAxis.inside` and `yAxis.inside` . Please use the properties in the window configuration `axis` instead. For details, see the chart API [init(dcs, options)](/en-US/api/chart/init#parameters), instance API [createIndicator(value, isStack, paneOptions)](/en-US/api/instance/createIndicator#parameters) and [setPaneOptions(options)](/en-US/api/instance/setPaneOptions#parameters) .
+ Remove `overlay.rectText`, `candle.tooltip.text`, `indicator.tooltip.text`.
+ Remove `candle.tooltip.defaultValue`, `candle.tooltip.custom`, please use `candle.tooltip.legend` instead.
+ Remove `indicator.tooltip.showName`, `indicator.tooltip.showParams`, please use `indicator.tooltip.title` instead.
+ Remove `indicator.tooltip.defaultValue`, please use `indicator.tooltip.legend` instead.
+ `candle.tooltip.icons` changed to `candle.tooltip.features`, `indicator.tooltip.icons` changed to `indicator.tooltip.features`.

## API adjustment

### Chart API
+ Remove `utils.drawArc(ctx, arc, styles)` , `utils.drawCircle(ctx, circle, styles)` , `utils.drawLine(ctx, line, styles)` , `utils.drawPolygon(ctx, polygon, styles)` , `utils.drawRect(ctx, rect, styles)` , `utils.drawText(ctx, text, styles)` , `utils.drawRectText(ctx, rectText, styles)` , please use `getFigureClass(name)` instead.
+ `init(dcs, options)`, `position` in `options.layout` sub-item changed to `order`, `options.customApi` changed to `options.formatter`, among which `formatDate(dateTimeFormat, timestamp, format, type)` changed to `formatDate({ dateTimeFormat, timestamp, format, type })`, `options.thousandsSeparator` changed to object `{ sign, format }`, `options.decimalFoldThreshold` changed to `options.decimalFold`.

### Instance API
+ Remove `setCustomApi(api)`, please use `setFormatter(formatter)` instead.
+ Remove `getCustomApi(api)`, please use `getFormatter(formatter)` instead.
+ Remove `setPriceVolumePrecision(pricePrecision, volumePrecision)`, please use `setSymbol(symbolInfo)` instead.
+ Remove `applyNewData(dataList, data, callback)`, `applyMoreData(dataList, more, callback)`, `updateData(data, callback)`, `setLoadDataCallback(cb)` and `loadMore(cb)`, please use `setDataLoader(loader)` instead.
+ Remove `clearData()`
+ Remove `getIndicatorByPaneId(paneId, name)`, please use `getIndicators(filter)` instead.
+ Remove `getOverlayById(id)`, please use `getOverlays(filter)` instead.
+ Remove `onTooltipIconClick` in `subscribeAction` and `unsubscribeAction`, please use `onCandleTooltipFeatureClick` and `onIndicatorTooltipFeatureClick` in indicators instead.
+ `getBarSpace()` return value changed to object.
+ `createIndicator` return value changed to return indicator id.

## Extension adjustment
+ The indicator `createTooltipDataSource` method return value `values` changed to `legends` , `icons` changed to `features` .
+ The return value of the `calc` method of the indicator has been changed from an array to an object whose key is a timestamp.
+ Remove the built-in basic graphic `rectText`, please use `text` instead.
