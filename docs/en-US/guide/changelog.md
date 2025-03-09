# 📠 Change Log

## 10.0.0-alpha5
`2025-03-09`
+ 👉 Style configuration `candle.tooltip.icons` changed to `candle.tooltip.features`, `indicator.tooltip.icons` changed to `indicator.tooltip.features`.
+ 👉 `icons` in the return value of the `createTooltipDataSource` method in the indicator changed to `features`.
+ 👉 The instance api `subscribeAction` and `unsubscribeAction` input parameter `onTooltipIconClick` changed to `onCandleTooltipFeatureClick`, and the indicator event is replaced by `indicator.onClick`.
+ 🐞 Fixed the problem that scrolling cannot be performed in certain situations on mobile terminals.
+ 💄 Optimize the display of overlay event response.

## 10.0.0-alpha4
`2025-02-23`
+ 🐞 Fix the issue that the parameter `more.backward` of `applyNewData` instance method is incorrect.
+ 🐞 Fix the issue that a single piece of data causes a chart error.

## 10.0.0-alpha3
`2025-02-19`
+ 👉 The return value of the instance api `createIndicator` is changed to return the indicator id.
+ 👉 The input parameter `paneId` of the instance api `overlayIndicator` is merged into the input parameter `indicator`.
+ 👉 The return value of the instance api `getIndicators` is changed to return an array.
+ 👉 The return value of the instance api `getOverlays` is changed to return an array.
+ 🆕 The style configuration adds `candle.bar.compareRule`, `indicator.ohlc.compareRule` and `candle.priceMark.last.compareRule`.
+ 🆕 Supports dragging the y-axis on mobile devices.
+ 🆕 Supports creating multiple indicators with the same name on the same window.
+ 💄 Optimize `figure` in `overlay` template to ignore event type, and the event name is consistent with the event name in `overlay`.
+ 🐞 Fix the problem that the indicator custom prompt information may be wrong.
+ 🐞 Fix the problem that the overlay being drawn may not be deleted correctly.
+ 🐞 Fix the problem that the api `createOverlay` may not be created correctly when `points` is specified.
+ 🐞 Fix the problem that the api `executeAction` may cause the `subscribeAction` to trigger infinitely.

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
