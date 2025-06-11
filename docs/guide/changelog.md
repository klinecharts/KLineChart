# 📠 更新日志

## 10.0.0-alpha6
`2025-06-12`
+ 👉 图表api `init(ds, options)` 中的 `options.customApi` 变更为 `options.formatter` ， `formatDate` 参数变更为对象。
+ 👉 实例api `setCustomApi` 变更为 `setFormatter` ， `getCustomApi` 变更为 `getFormatter`。
+ 🆕 样式配置新增 `candle.priceMark.last.extendTexts` ， `candle.tooltip.title` ， `candle.tooltip.legend` ， `indicator.tooltip.title` ， `indicator.tooltip.legend` ， 和 `crosshair.horizontal.features` 。
+ 🆕 实例方法新增 `setDataLoader` ， `setSymbol` ， `getSymbol` ， `setPeriod` ， `getPeriod` 和 `resetData` 。
+ 🆕 实例api的 `subscribeAction` 和 `unsubscribeAction` ， 入参 `type` 新增 `onIndicatorTooltipFeatureClick` 和 `onCrosshairFeatureClick` 。
+ 🗑 样式配置删除 `candle.tooltip.defaultValue` ， `candle.tooltip.custom` 请替换为 `candle.tooltip.legend` ，删除 `candle.tooltip.text` ，删除 `indicator.tooltip.showName` ， `indicator.tooltip.showParams` ，请用 `indicator.tooltip.title` ，删除 `indicator.tooltip.defaultValue` ， 请替换为 `indicator.tooltip.legend` ， 删除 `indicator.tooltip.text` 。
+ 🗑 实例api删除 `setLoadMoreData` ， `applyNewData` ， `updateData` ， 请替换为 `setDataLoader` ， 删除 `clearData` ， `setPrecision` 和 `getPrecision`。
+ 🐞 修复覆盖物 `onSelected` 和 `onDeselected` 响应错乱问题。
+ 🐞 修复样式配置 `candle.type` 是 `ohlc` 时的显示问题。
+ 💄 优化覆盖物事件默认事件响应。
+ 💄 优化x轴显示。

## 10.0.0-alpha5
`2025-03-09`
+ 👉 样式配置 `candle.tooltip.icons` 变更为 `candle.tooltip.features` ， `indicator.tooltip.icons` 变更为 `indicator.tooltip.features` 。
+ 👉 指标中的 `createTooltipDataSource` 方法返回值中的 `icons` 变更为 `features` 。
+ 👉 实例api `subscribeAction` 和 `unsubscribeAction` 入参 `onTooltipIconClick` 变更为 `onCandleTooltipFeatureClick` ，指标的事件用 `indicator.onClick` 代替。
+ 🐞 修复移动端特定情况下无法滚动问题。
+ 💄 优化覆盖物事件响应显示。

## 10.0.0-alpha4
`2025-02-23`
+ 🐞 修复实例方法 `applyNewData` 入参 `more.backward` 不对问题。
+ 🐞 修复单条数据导致图表出错问题。


## 10.0.0-alpha3
`2025-02-19`
+ 👉 实例api `createIndicator` 返回值变更为返回指标id。
+ 👉 实例api `overlayIndicator` 入参 `paneId` 合并到入参 `indicator` 中。
+ 👉 实例api `getIndicators` 返回值变更为返回数组。
+ 👉 实例api `getOverlays` 返回值变更为返回数组。
+ 🆕 样式配置新增 `candle.bar.compareRule` ， `indicator.ohlc.compareRule` 和 `candle.priceMark.last.compareRule` 。
+ 🆕 支持在移动端y轴拖动。
+ 🆕 支持在同一窗口上创建多个相同名称的指标。
+ 💄 优化 `overlay` 模版中的 `figure` 忽略事件类型，事件名和 `overlay` 中的事件名称一致。
+ 🐞 修复指标自定义提示信息可能出错问题。
+ 🐞 修复正在绘制中的覆盖物可能不正确删除问题。
+ 🐞 修复api `createOverlay` 在指定 `points` 时，可能不能正确创建问题。
+ 🐞 修复api `executeAction` 可能导致 `subscribeAction` 无限触发问题。

## 10.0.0-alpha2
`2024-12-20`
+ 🆕 x轴支持显示未来时间。
+ 🐞 修复 `subscribeAction` 类型是 `ActionType.OnCandleBarClick` 不生效问题。

## 10.0.0-alpha1
`2024-12-01`
+ 🆕 新特性
  + 支持千分符，小数折叠自定义。
  + 重写坐标轴模块，自定义y轴支持设置范围。
  + 新增实例方法 `setPrecision(precision)` ， `getPrecision()` ， `setThousandsSeparator(thousandsSeparator)` ， `getThousandsSeparator()` ， `setDecimalFold(decimalFold)` ， `getDecimalFold()` 和 `setLoadMoreDataCallback(cb)` 。
+ 👉 变更
  + 图表方法 `init(dcs, options)` ， `options.layout` 子项中的 `position` 变更为 `order` ， `options.customApi` 中的 `formatDate(dateTimeFormat, timestamp, format, type)` 变更为 `formatDate(timestamp, format, type)` ， `options.thousandsSeparator` 变更为对象 `{ sign, format }` ， `options.decimalFoldThreshold` 变更为 `options.decimalFold` 。
  + 实例方法 `applyNewData(dataList, more, callback)` 变更为 `applyNewData(dataList, more)` 。
  + 实例方法 `updateData(data, callback)` 变更为 `updateData(data)` 。
  + 实例方法 `getBarSpace()` 返回值变更为对象。
  + 自定义指标 `createTooltipDataSource` 方法返回值 `values` 变更为 `legends` 。
+ 🗑 废弃
  + 图表方法删除 `utils.drawArc(ctx, arc, styles)` ，`utils.drawCircle(ctx, circle, styles)` ， `utils.drawLine(ctx, line, styles)` ，`utils.drawPolygon(ctx, polygon, styles)` ， `utils.drawRect(ctx, rect, styles)` ，`utils.drawText(ctx, text, styles)` ， `utils.drawRectText(ctx, rectText, styles)`，请使用 `getFigureClass(name)` 代替。
  + 实例方法删除 `setPriceVolumePrecision(pricePrecision, volumePrecision)` ，请使用 `setPrecision(precision)` 代替。
  + 实例方法删除 `applyMoreData(dataList, more, callback)` ， `setLoadDataCallback(cb)` 和 `loadMore(cb)` ，请使用 `setLoadMoreDataCallback(cb)` 代替。
  + 实例方法删除 `getIndicatorByPaneId(paneId, name)` ，请使用 `getIndicators(filter)` 代替。
  + 实例方法删除 `getOverlayById(id)` ，请使用 `getOverlays(filter)` 代替。
  + 样式配置删除 `yAxis.position` ， `yAxis.type` ， `yAxis.inside` 和 `yAxis.inside` ，请使用窗口配置 `axis` 中的属性代替。详情参阅图表API [init(dcs, options)](/api/chart/init#parameters) ，实例API [createIndicator(value, isStack, paneOptions)](/api/instance/createIndicator#parameters) 和 [setPaneOptions(options)](/api/instance/setPaneOptions#parameters) 。
  + 样式配置删除 `overlay.rectText` 。
  + 内置的基础图形删除 `rectText` ，请使用 `text` 代替。

## 9.x

去 [https://v9.klinecharts.com](https://v9.klinecharts.com) 上查看。


## 8.x

去 [https://v8.klinecharts.com](https://v8.klinecharts.com) 上查看。


## 7.x

去 [Github](https://github.com/liihuu/KLineChart/blob/v7.5.0/docs/zh-CN/changelog.md) 上查看 7.x 的 Change Log。

## 6.x

去 [Github](https://github.com/liihuu/KLineChart/blob/v6.1.0/docs/zh-CN/CHANGELOG.md) 上查看 6.x 的 Change Log。

## 5.x

去 [Github](https://github.com/liihuu/KLineChart/releases/tag/v5.0.0) 上查看 5.x 的版本记录。

## 4.x

去 [Github](https://github.com/liihuu/KLineChart/releases/tag/v4.0.0) 上查看 4.x 的版本记录。
