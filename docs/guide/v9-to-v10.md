# 🛠️ 从 V9 到 V10
本文档将帮助你从 klinecharts 9.x 版本升级到 klinecharts 10.x 版本，如果你是 8.x 或者更老的版本，请先参考 [v8 到 v9](https://v9.klinecharts.com/guide/v8-to-v9) 升级到 9.x。

## 样式配置调整
+ 删除 `yAxis.position` ， `yAxis.type` ， `yAxis.inside` 和 `yAxis.inside` ，请使用 [overrideYAxis(options)](/api/instance/overrideYAxis#parameters) 代替。详情参阅图表API [init(dcs, options)](/api/chart/init#parameters) ，实例API [createIndicator(indicator, options)](/api/instance/createIndicator#parameters) 、 [setPaneOptions(options)](/api/instance/setPaneOptions#parameters) 和 [overrideYAxis(options)](/api/instance/overrideYAxis#parameters) 。
+ 删除 `overlay.rectText` ， `candle.tooltip.text` ， `indicator.tooltip.text`。
+ 删除 `candle.tooltip.defaultValue` ， `candle.tooltip.custom` 请用 `candle.tooltip.legend` 代替。
+ 删除 `indicator.tooltip.showName` ， `indicator.tooltip.showParams` ，请用 `indicator.tooltip.title` 代替。
+ 删除 `indicator.tooltip.defaultValue` ， 请用 `indicator.tooltip.legend` 代替。
+ `candle.tooltip.icons` 变更为 `candle.tooltip.features` ， `indicator.tooltip.icons` 变更为 `indicator.tooltip.features` 。

## API调整

### 图表API
+ 删除 `utils.drawArc(ctx, arc, styles)` ，`utils.drawCircle(ctx, circle, styles)` ， `utils.drawLine(ctx, line, styles)` ，`utils.drawPolygon(ctx, polygon, styles)` ， `utils.drawRect(ctx, rect, styles)` ，`utils.drawText(ctx, text, styles)` ， `utils.drawRectText(ctx, rectText, styles)`，请使用 `getFigureClass(name)` 代替。
+ `init(dcs, options)` ， `options.layout` 子项中的 `position` 变更为 `order` ， `options.customApi` 变更为 `options.formatter`， 其中 `formatDate(dateTimeFormat, timestamp, format, type)` 变更为 `formatDate({ dateTimeFormat, timestamp, format, type })` ， `options.thousandsSeparator` 变更为对象 `{ sign, format }` ， `options.decimalFoldThreshold` 变更为 `options.decimalFold` 。

### 实例API
+ 删除 `setCustomApi(api)` 请使用 `setFormatter(formatter)` 代替。
+ 删除 `getCustomApi(api)` 请使用 `getFormatter(formatter)` 代替。
+ 删除 `setPriceVolumePrecision(pricePrecision, volumePrecision)` ，请使用 `setSymbol(symbolInfo)` 代替。
+ 删除 `applyNewData(dataList, data, callback)` ， `applyMoreData(dataList, more, callback)` ， `updateData(data, callback)` `setLoadDataCallback(cb)` 和 `loadMore(cb)` ，请使用 `setDataLoader(loader)` 代替。
+ 删除 `clearData()`
+ 删除 `getIndicatorByPaneId(paneId, name)` ，请使用 `getIndicators(filter)` 代替。
+ 删除 `getOverlayById(id)` ，请使用 `getOverlays(filter)` 代替。
+ 删除 `subscribeAction` 和 `unsubscribeAction` 中的 `onTooltipIconClick` ，请使用 `onCandleTooltipFeatureClick` 和指标中的 `onIndicatorTooltipFeatureClick` 代替。
+ `getBarSpace()` 返回值变更为对象。
+ `createIndicator` 返回值变更为返回指标id。

## 自定义扩展调整
+ 指标 `createTooltipDataSource` 方法返回值 `values` 变更为 `legends` ， `icons` 变更为 `features`。
+ 指标 `calc` 方法返回值由数组变更为key为时间戳的对象。
+ 删除内置的基础图形 `rectText` ，请使用 `text` 代替。
