# 📠 Change Log

## 10.0.0-alpha2
`2024-12-20`
+ 🆕 The x-axis supports displaying future time.
+ 🐞 Fix the issue that `subscribeAction` type is `ActionType.OnCandleBarClick` and it does not work.

## 10.0.0-alpha1
`2024-12-01`
+ 🆕 New features
  + Support thousand separators and custom decimal folding.
  + Rewrite the axis module, and customize the y-axis to support setting ranges.
  + Add instance methods `setPrecision(precision)` , `getPrecision()` , `setThousandsSeparator(thousandsSeparator)` , `getThousandsSeparator()` , `setDecimalFold(decimalFold)` , `getDecimalFold()` and `setLoadMoreDataCallback(cb)` .
+ 👉 Changes
  + Chart api `init(dcs, options)`, `position` in `options.layout` child changed to `order` , `formatDate(dateTimeFormat, timestamp, format, type)` in `options.customApi` changed to `formatDate(timestamp, format, type)` , `options.thousandsSeparator` changed to object `{ sign, format }` , `options.decimalFoldThreshold` changed to `options.decimalFold` .
  + Instance api `applyNewData(dataList, more, callback)` changed to `applyNewData(dataList, more)` .
  + Instance api `updateData(data, callback)` changed to `updateData(data)` .
  + Instance api `getBarSpace()` return value changed to object.
  + The return value of the custom indicator `createTooltipDataSource` method `values` is changed to `legends` .
+ 🗑 Deprecated
  + Remove chart api `utils.drawArc(ctx, arc, styles)`, `utils.drawCircle(ctx, circle, styles)`, `utils.drawLine(ctx, line, styles)`, `utils.drawPolygon(ctx, polygon, styles)`, `utils.drawRect(ctx, rect, styles)`, `utils.drawText(ctx, text, styles)`, `utils.drawRectText(ctx, rectText, styles)`, please use `getFigureClass(name)` instead.
  + Remove instance api `setPriceVolumePrecision(pricePrecision, volumePrecision)`, please use `setPrecision(precision)` instead.
  + Remove instance api `applyMoreData(dataList, more, callback)`, `setLoadDataCallback(cb)` and `loadMore(cb)`, please use `setLoadMoreDataCallback(cb)` instead.
  + Remove instance api `getIndicatorByPaneId(paneId, name)`, please use `getIndicators(filter)` instead.
  + Remove instance api `getOverlayById(id)`, please use `getOverlays(filter)` instead.
  + Remove style configuration `yAxis.position` , `yAxis.type` , `yAxis.inside` and `yAxis.inside` , please use the properties in the window configuration `axis` instead. For details, refer to the chart API [init(dcs, options)](/api/chart/init#parameters), the instance API [createIndicator(value, isStack, paneOptions)](/api/instance/createIndicator#parameters) and [setPaneOptions(options)](/api/instance/setPaneOptions#parameters).
  + Remove `overlay.rectText` from style configuration.
  + Remove `rectText` from built-in basic graphics, please use `text` instead.

## 9.x

Go to [https://v9.klinecharts.com](https://v9.klinecharts.com) to check the change log for 9.x.

## 8.x

Go to [https://v8.klinecharts.com](https://v8.klinecharts.com) to check the change log for 9.x.

## 7.x

Go to [Github](https://github.com/liihuu/KLineChart/blob/v7.5.0/docs/en/changelog.md) to check the change log for 7.x.

## 6.x

Go to [Github](https://github.com/liihuu/KLineChart/blob/v6.1.0/docs/en/CHANGELOG.md) to check the change log for 6.x.

## 5.x

Go to [Github](https://github.com/liihuu/KLineChart/releases/tag/v5.0.0) to view the 5.x release notes.

## 4.x

Go to [Github](https://github.com/liihuu/KLineChart/releases/tag/v4.0.0) to view the 4.x release notes.
