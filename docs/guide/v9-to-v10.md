# 🛠️ 从 V9 到 V10
本文档将帮助你从 klinecharts 9.x 版本升级到 klinecharts 10.x 版本，如果你是 8.x 或者更老的版本，请先参考 [v8 到 v9](https://v9.klinecharts.com/guide/v8-to-v9) 升级到 9.x。

## 样式配置调整
+ 删除 `yAxis.position` ， `yAxis.type` ， `yAxis.inside` 和 `yAxis.inside` ，请使用窗口配置 `axis` 中的属性代替。详情参阅图表API [init(dcs, options)](/api/chart/init#parameters) ，实例API [createIndicator(value, isStack, paneOptions)](/api/instance/createIndicator#parameters) 和 [setPaneOptions(options)](/api/instance/setPaneOptions#parameters) 。
+ 删除 `overlay.rectText` 。

## API调整

### 图表API
+ 删除 `utils.drawArc(ctx, arc, styles)` ，`utils.drawCircle(ctx, circle, styles)` ， `utils.drawLine(ctx, line, styles)` ，`utils.drawPolygon(ctx, polygon, styles)` ， `utils.drawRect(ctx, rect, styles)` ，`utils.drawText(ctx, text, styles)` ， `utils.drawRectText(ctx, rectText, styles)`，请使用 `getFigureClass(name)` 代替。
+ `init(dcs, options)` ， `options.layout` 子项中的 `position` 变更为 `order` ， `options.customApi` 中的 `formatDate(dateTimeFormat, timestamp, format, type)` 变更为 `formatDate(timestamp, format, type)` ， `options.thousandsSeparator` 变更为对象 `{ sign, format }` ， `options.decimalFoldThreshold` 变更为 `options.decimalFold` 。

### 实例API
+ 删除 `setPriceVolumePrecision(pricePrecision, volumePrecision)` ，请使用 `setPrecision(precision)` 代替。
+ 删除 `applyMoreData(dataList, more, callback)` ， `setLoadDataCallback(cb)` 和 `loadMore(cb)` ，请使用 `setLoadMoreDataCallback(cb)` 代替。
+ 删除 `getIndicatorByPaneId(paneId, name)` ，请使用 `getIndicators(filter)` 代替。
+ 删除 `getOverlayById(id)` ，请使用 `getOverlays(filter)` 代替。
+ `applyNewData(dataList, more, callback)` 变更为 `applyNewData(dataList, more)` 。
+ `updateData(data, callback)` 变更为 `updateData(data)` 。
+ `getBarSpace()` 返回值变更为对象。

## 自定义扩展调整
+ 指标 `createTooltipDataSource` 方法返回值 `values` 变更为 `legends` 。
+ 删除内置的基础图形 `rectText` ，请使用 `text` 代替。
