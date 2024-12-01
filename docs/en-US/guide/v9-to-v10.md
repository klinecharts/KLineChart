# 🛠️ From 9.x to 10.x
This document will help you upgrade from klinecharts version 9.x to klinecharts version 10.x. If you are using version 8.x or older, please refer to [v8 to v9](https://v9.klinecharts.com/en-US/guide/v8-to-v9) to upgrade to 9.x first.

## Style configuration adjustment
+ Remove `yAxis.position` , `yAxis.type` , `yAxis.inside` and `yAxis.inside` . Please use the properties in the window configuration `axis` instead. For details, see the chart API [init(dcs, options)](/en-US/api/chart/init#parameters), instance API [createIndicator(value, isStack, paneOptions)](/en-US/api/instance/createIndicator#parameters) and [setPaneOptions(options)](/en-US/api/instance/setPaneOptions#parameters) .
+ Remove `overlay.rectText` .

## API adjustment

### Chart API
+ Remove `utils.drawArc(ctx, arc, styles)` , `utils.drawCircle(ctx, circle, styles)` , `utils.drawLine(ctx, line, styles)` , `utils.drawPolygon(ctx, polygon, styles)` , `utils.drawRect(ctx, rect, styles)` , `utils.drawText(ctx, text, styles)` , `utils.drawRectText(ctx, rectText, styles)` , please use `getFigureClass(name)` instead.
+ `init(dcs, options)` , `position` in `options.layout` sub-item changed to `order` , `formatDate(dateTimeFormat, timestamp, format, type)` in `options.customApi` changed to `formatDate(timestamp, format, type)` , `options.thousandsSeparator` changed to object `{ sign, format }` , `options.decimalFoldThreshold` changed to `options.decimalFold` .

### Instance API
+ Remove `setPriceVolumePrecision(pricePrecision, volumePrecision)`, please use `setPrecision(precision)` instead.
+ Remove `applyMoreData(dataList, more, callback)` , `setLoadDataCallback(cb)` and `loadMore(cb)` , please use `setLoadMoreDataCallback(cb)` instead.
+ Remove `getIndicatorByPaneId(paneId, name)`, please use `getIndicators(filter)` instead.
+ Remove `getOverlayById(id)`, please use `getOverlays(filter)` instead.
+ `applyNewData(dataList, more, callback)` is changed to `applyNewData(dataList, more)` .
+ `updateData(data, callback)` is changed to `updateData(data)` .
+ `getBarSpace()` return value changed to object.

## Extension adjustment
+ The indicator `createTooltipDataSource` method return value `values` changed to `legends` .
+ Remove the built-in basic graphic `rectText`, please use `text` instead.
