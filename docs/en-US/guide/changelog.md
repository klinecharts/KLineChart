# 📠 Change Log

## 10.0.2
`2026-08-06`
+ 💄 Optimize path figure parsing and caching to reduce the overhead of repeatedly parsing SVG paths. [@NemeZZiZZ](https://github.com/NemeZZiZZ) [@liihuu](https://github.com/liihuu) 
+ 💄 Optimize value lookup performance for simple fields during formatting. [@NemeZZiZZ](https://github.com/NemeZZiZZ)
+ 🐞 Fix an incorrect middle-price formula in the built-in `CR` indicator. [@NemeZZiZZ](https://github.com/NemeZZiZZ)
+ 🐞 Fix the lookback period and moving average start position in the built-in `ROC` indicator. [@NemeZZiZZ](https://github.com/NemeZZiZZ)
+ 🐞 Fix the built-in `SAR` indicator resetting its acceleration factor incorrectly on a downtrend-to-uptrend reversal. [@NemeZZiZZ](https://github.com/NemeZZiZZ)
+ 🐞 Fix `formatBigNumber` incorrectly formatting negative values and exact magnitude boundaries. [@NemeZZiZZ](https://github.com/NemeZZiZZ)
+ 🐞 Fix the percentage y-axis potentially producing `NaN` for flat data or a zero base price. [@NemeZZiZZ](https://github.com/NemeZZiZZ)
+ 🐞 Fix dragging an overlay control point potentially replacing a valid timestamp with an invalid value. [@NemeZZiZZ](https://github.com/NemeZZiZZ)
+ 🐞 Fix y-axis tick label collision detection incorrectly using the x-axis text size. [@NemeZZiZZ](https://github.com/NemeZZiZZ)
+ 🐞 Fix repeated `init` calls failing to identify a chart already initialized on the same container. [@NemeZZiZZ](https://github.com/NemeZZiZZ)
+ 🐞 Fix the horizontal position of crosshair path features not accounting for padding. [@liihuu](https://github.com/liihuu) 


## 10.0.1
`2026-08-01`
+ 💄 Improve mobile inertial scrolling for smoother and more consistent animations. [@liihuu](https://github.com/liihuu) 
+ 💄 Improve mobile touch handling to prevent page scrolling and browser navigation gestures while dragging the chart. [@liihuu](https://github.com/liihuu) 
+ 💄 Improve the state and lifecycle management of area chart ripple animations. [@liihuu](https://github.com/liihuu) 
+ 💄 Improve Canvas rendering scheduling, resizing, and device pixel ratio handling. [@liihuu](https://github.com/liihuu) 
+ 🐞 Fix an incorrect formula in the built-in `PVT` indicator. [@snoofox](https://github.com/snoofox)
+ 🐞 Fix `rgbToHex` incorrectly using the red channel value when converting the green and blue channels. [@0-v-0](https://github.com/0-v-0)
+ 🐞 Fix regular expression errors in `hsla` color validation and transparent color detection. [@0-v-0](https://github.com/0-v-0)
+ 🐞 Fix declaration file builds failing in some environments. [@asfand987](https://github.com/asfand987)


## 10.0.0
`2026-07-11`

The current 10.x release is a major upgrade from 9.x. It reorganizes data loading, layout, axes, indicators, overlays, formatting, and style configuration.

### New Features
+ 🆕 Support multiple y-axes. A pane can contain multiple y-axes, and indicators can bind to a specific axis with `indicator.yAxisId`.
+ 🆕 Add instance methods `createYAxis(yAxis)`, `removeYAxis(filter)`, `getYAxes(filter)`, `overrideYAxis(options)`, and `overrideXAxis(options)`.
+ 🆕 Support custom hotkeys, with the new `hotkey` option and APIs such as `setHotkey`, `getHotkey`, `registerHotkey`, and `getSupportedHotkeys`.
+ 🆕 Add continuous drawing mode for overlays, and add the built-in `brush` overlay.
+ 🆕 Support custom thousands separators and decimal-zero folding.
+ 🆕 Support zoom anchors with the `zoomAnchor` option and `setZoomAnchor(anchor)` / `getZoomAnchor()`.
+ 🆕 Add `setDataLoader(loader)` for historical data, realtime data, and backward loading.
+ 🆕 Add `setSymbol(symbol)`, `getSymbol()`, `setPeriod(period)`, and `getPeriod()`.
+ 🆕 Support future time on the x-axis.
+ 🆕 Support y-axis dragging on mobile.
+ 🆕 Support multiple indicators with the same name in the same pane.
+ 🆕 Rewrite the axis module. Custom y-axes can define ranges and ticks.
+ 🆕 Add the `text` figure type for indicators.
+ 🆕 Add `getIndicators(filter)` and `getOverlays(filter)`.
+ 🆕 Add style options including `candle.priceMark.last.extendTexts`, `candle.tooltip.title`, `candle.tooltip.legend`, `indicator.tooltip.title`, `indicator.tooltip.legend`, `crosshair.horizontal.features`, `candle.bar.compareRule`, `indicator.ohlc.compareRule`, and `candle.priceMark.last.compareRule`.
+ 🆕 Add `onIndicatorTooltipFeatureClick` and `onCrosshairFeatureClick` action types.

### Changes
+ 👉 In `init(ds, options)`, `options.layout` is now a default layout configuration object:
  + `layout.barSpaceLimit` configures bar-space limits.
  + `layout.pane` configures default pane options.
  + `layout.yAxis` configures default y-axis options.
+ 👉 `createIndicator(indicator, options?)` is adjusted to `createIndicator(indicator, isStack?)`. Use `indicator.paneId` for pane placement and `indicator.yAxisId` for y-axis binding.
+ 👉 `setPaneOptions(options)` only configures pane options. Use `overrideXAxis(options)`, `overrideYAxis(options)`, or the multi-y-axis APIs for axis configuration.
+ 👉 Add `yAxisId` to the `filter` parameter of `convertToPixel(value, filter?)` and `convertFromPixel(coordinate, filter?)`.
+ 👉 `options.customApi` is renamed to `options.formatter`; `setCustomApi` is renamed to `setFormatter`; `getCustomApi` is renamed to `getFormatter`.
+ 👉 `formatDate(dateTimeFormat, timestamp, format, type)` is changed to `formatDate({ dateTimeFormat, timestamp, template, type })`.
+ 👉 `options.thousandsSeparator` is changed to an object `{ sign, format }`.
+ 👉 `options.decimalFoldThreshold` is changed to `options.decimalFold`.
+ 👉 `getBarSpace()` now returns an object.
+ 👉 `createIndicator` now returns the indicator id.
+ 👉 Custom indicator `calc` now returns an object keyed by timestamp instead of an array.
+ 👉 In custom indicator `createTooltipDataSource`, `values` is renamed to `legends`, and `icons` is renamed to `features`.
+ 👉 `candle.tooltip.icons` is renamed to `candle.tooltip.features`; `indicator.tooltip.icons` is renamed to `indicator.tooltip.features`.
+ 👉 Adjust the calculation logic of the built-in `RSI` indicator.

### Removed
+ 🗑 Remove `utils.drawArc`, `utils.drawCircle`, `utils.drawLine`, `utils.drawPolygon`, `utils.drawRect`, `utils.drawText`, and `utils.drawRectText`. Use `getFigureClass(name)` instead.
+ 🗑 Remove `setPriceVolumePrecision(pricePrecision, volumePrecision)`. Use precision fields in `setSymbol(symbol)`.
+ 🗑 Remove `setLoadMoreData`, `applyNewData`, `applyMoreData`, `updateData`, `setLoadDataCallback`, and `loadMore`. Use `setDataLoader(loader)`.
+ 🗑 Remove `clearData()`. Use `resetData()` to reload data.
+ 🗑 Remove `getIndicatorByPaneId(paneId, name)`. Use `getIndicators(filter)`.
+ 🗑 Remove `getOverlayById(id)`. Use `getOverlays(filter)`.
+ 🗑 Remove `onTooltipIconClick` from `subscribeAction` and `unsubscribeAction`. Use `onCandleTooltipFeatureClick` and `onIndicatorTooltipFeatureClick`.
+ 🗑 Remove style options `yAxis.position`, `yAxis.type`, and `yAxis.inside`. Use default `layout.yAxis` options or instance y-axis APIs.
+ 🗑 Remove style options `candle.tooltip.defaultValue`, `candle.tooltip.custom`, `candle.tooltip.text`, `indicator.tooltip.showName`, `indicator.tooltip.showParams`, `indicator.tooltip.defaultValue`, `indicator.tooltip.text`, and `overlay.rectText`.
+ 🗑 Remove the built-in `rectText` figure. Use `text` instead.

### Fixes and Optimizations
+ 🐞 Fix scrolling when an event falls on a locked overlay.
+ 🐞 Fix overlays that are force-ended during drawing not being restorable through `createOverlay`.
+ 🐞 Fix overlay drawing response in weak magnet mode.
+ 🐞 Fix data callbacks being triggered repeatedly when loading data backward.
+ 🐞 Fix cases where `resize` may not take effect.
+ 🐞 Fix the parameter type of `setZoomAnchor`.
+ 💄 Automatically observe container size changes and call `resize()`.
+ 💄 Optimize ignored figure events in overlay templates so event names align with overlay events.
+ 💄 Optimize indicator calculation tasks.
+ 💄 Optimize mobile scrolling events.
+ 💄 Change the build tool from Rollup to Vite and add `type-check`.

## 9.x

Go to [https://v9.klinecharts.com](https://v9.klinecharts.com) to check the change log for 9.x.

## 8.x

Go to [https://v8.klinecharts.com](https://v8.klinecharts.com) to check the change log for 8.x.

## 7.x

Go to [Github](https://github.com/liihuu/KLineChart/blob/v7.5.0/docs/en/changelog.md) to check the change log for 7.x.

## 6.x

Go to [Github](https://github.com/liihuu/KLineChart/blob/v6.1.0/docs/en/CHANGELOG.md) to check the change log for 6.x.

## 5.x

Go to [Github](https://github.com/liihuu/KLineChart/releases/tag/v5.0.0) to view the 5.x release notes.

## 4.x

Go to [Github](https://github.com/liihuu/KLineChart/releases/tag/v4.0.0) to view the 4.x release notes.
