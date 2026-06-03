# 📠 Change Log

## 10.0.0-beta3
`2026-06-03`
+ 🆕 Support custom hot keys.
+ 🆕 A new continuous drawing mode is added to the cover, and a `brush` is added to the built-in cover.
+ 👉 Adjust the calculation logic of the built-in indicator `RSI`.
+ 🐞 Fix the problem that when the overlay is locked, the event falls on the overlay and the chart cannot be scrolled.
+ 🐞 Fix the problem that overlays that are forced to end drawing cannot be restored through `createOverlay`.
+ 🐞 Fix the issue of drawing response in overlay field weakening mode.
+ 🐞 Fix an issue where data request method callbacks may be triggered infinitely when loading data backwards.
+ 🐞 Fix the problem that `resize` may not take effect.

## 10.0.0-beta2
`2026-05-20`
+ 🆕 New Features
  + Support multiple y-axes. Multiple y-axes can be created in the same pane, and indicators can be bound to a specified y-axis through `yAxisId`.
  + Add instance methods `overrideXAxis(options)` and `overrideYAxis(options)` for independently configuring the x-axis and y-axis.
  + The chart now supports automatically listening to container size changes and calling `resize()`.
  + Add the `text` type to indicator figures, allowing indicator `figures` to draw text directly.

+ 👉 Changes
  + In the chart method `init(ds, options)`, `options.layout` has been changed from an array structure to an object structure, with `basicParams` and `panes` added:
    + `basicParams` supports configuring `barSpaceLimitMin`, `barSpaceLimitMax`, `yAxisPosition`, `yAxisInside`, `paneMinHeight`, and `paneHeight`.
    + `panes` is used to configure pane layout, and pane content supports specifying a y-axis configuration for an indicator through `{ indicator, yAxis }`.
  + The instance method `createIndicator(indicator, isStack?, paneOptions?)` has been changed to `createIndicator(indicator, options?)`, and `options` supports `isStack`, `pane`, and `yAxis`.
  + `setPaneOptions(options)` no longer includes axis configuration. Use `overrideXAxis(options)` or `overrideYAxis(options)` for axis configuration.
  + Add `yAxisId` to the `filter` parameter of `convertToPixel(value, filter?)` and `convertFromPixel(coordinate, filter?)`.
+ 🐞 Fixed the parameter type error of the instance API `setZoomAnchor`.
+ 💄 Optimized the build process. The build tool has been changed from rollup to Vite, and `type-check` has been added.

## 10.0.0-beta1
`2025-11-21`
+ 🆕 New Features
  + Support thousands separators and custom decimal collapse.
  + Support displaying future time on the x-axis.
  + Support dragging the y-axis on mobile devices.
  + Support creating multiple metrics with the same name on the same window.
  + Rewrote the axis module; custom y-axis supports setting the range.
  + Add `zoomAnchor` to the `options` method of the chart method `init(dom, options)`.
  + New instance methods `setZoomAnchor(anchor)`, `getZoomAnchor()`, `setDataLoader(loader)`, `setSymbol(symbol)`, `getSymbol()`, `setPeriod(period)`, `getPeriod()`, `resetData()`, `setThousandsSeparator(thousandsSeparator)` , `getThousandsSeparator()` , `setDecimalFold(decimalFold)` , `getDecimalFold()` , `getIndicators()` and `getOverlays()` . 
  + Add style configurations: `candle.priceMark.last.extendTexts`, `candle.tooltip.title`, `candle.tooltip.legend`, `indicator.tooltip.title`, `indicator.tooltip.legend`, `crosshair.horizontal.features`, `candle.bar.compareRule`, `indicator.ohlc.compareRule`, and `candle.priceMark.last.compareRule`.
  + Add `onIndicatorTooltipFeatureClick` and `onCrosshairFeatureClick` to the `type` parameter in the instance methods `subscribeAction` and `unsubscribeAction`.
+ 👉 Changes
  + In the chart method `init(dcs, options)`, the `position` sub-item of `options.layout` has been changed to `order`, `options.thousandsSeparator` has been changed to the object `{ sign, format }`, `options.decimalFoldThreshold` has been changed to `options.decimalFold`, `options.customApi` has been changed to `options.formatter`, and the parameter of `formatDate` has been changed to an object.
  + In the instance methods `setCustomApi` and `getCustomApi` have been changed to `getFormatter`, the return value of `getBarSpace()` has been changed to an object, the return value of `createIndicator` has been changed to return the indicator ID, and the input parameter `paneId` of `overlayIndicator` has been merged into the input parameter `indicator`.
  + The return value of the custom metric `createTooltipDataSource` method has been changed from `values` to `legends`, and `icons` to `features`.
  + The style configurations `candle.tooltip.icons` and `indicator.tooltip.icons` have been changed to `indicator.tooltip.features`.
+ 💄 Optimizations
  + Optimized the `figure` element in the overlay template to ignore event types, ensuring the event name matches the event name in `overlay`.
  + Optimized the execution of metric calculation tasks.
  + Optimized the triggering of scroll events on mobile devices.

+ 🗑 Deprecated
  + The following chart methods have been removed: `utils.drawArc(ctx, arc, styles)`, `utils.drawCircle(ctx, circle, styles)`, `utils.drawLine(ctx, line, styles)`, `utils.drawPolygon(ctx, polygon, styles)`, `utils.drawRect(ctx, rect, styles)`, `utils.drawText(ctx, text, styles)`, `utils.drawRectText(ctx, rectText, styles)`. Please use `getFigureClass(name)` instead.
  + The following instance method has been removed: `setPriceVolumePrecision(pricePrecision, volumePrecision)`. Please use `setPrecision(precision)` instead.
  + In the instance API, remove `setLoadMoreData`, `applyNewData`, and `updateData`. Replace them with `setDataLoader`. Remove `clearData`, `setPrecision`, and `getPrecision`.
  + In the instance method, remove `getIndicatorByPaneId(paneId, name)`. Replace it with `getIndicators(filter)`.
  + In the instance method, remove `getOverlayById(id)`. Replace it with `getOverlays(filter)`.
  + In the instance methods `subscribeAction` and `unsubscribeAction`, remove the parameter `onTooltipIconClick`. Replace it with `onCandleTooltipFeatureClick` and `onIndicatorTooltipFeatureClick`.
  + The style configuration removes `yAxis.position`, `yAxis.type`, `yAxis.inside`, and `yAxis.inside`. Please use `[overrideYAxis(options)](/api/instance/overrideYAxis#parameters)` instead. For details, see the chart API `[init(dcs, options)](/api/chart/init#parameters)`, the instance APIs `[createIndicator(indicator, options)](/api/instance/createIndicator#parameters)`, `[setPaneOptions(options)](/api/instance/setPaneOptions#parameters)`, and `[overrideYAxis(options)](/api/instance/overrideYAxis#parameters)`.
  + In style configuration, remove `candle.tooltip.defaultValue` and replace `candle.tooltip.custom` with `candle.tooltip.legend`. Also remove `candle.tooltip.text`, `indicator.tooltip.showName`, and `indicator.tooltip.showParams`; use `indicator.tooltip.title` instead. Remove `indicator.tooltip.defaultValue` and replace it with `indicator.tooltip.legend`. Also remove `indicator.tooltip.text` and `overlay.rectText`.
  + In built-in basic graphics, remove `rectText` and replace it with `text`.

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
