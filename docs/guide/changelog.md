# 📠 更新日志

## 10.0.0-beta1
`2025-11-21`
+ 🆕 新特性
  + 支持千分符，小数折叠自定义。
  + x轴支持显示未来时间。
  + 支持在移动端y轴拖动。
  + 支持在同一窗口上创建多个相同名称的指标。
  + 重写坐标轴模块，自定义y轴支持设置范围。
  + 图表方法 `init(dom, options)` 中的 `options` 新增 `zoomAnchor` 。
  + 实例新增方法 `setZoomAnchor(anchor)` ， `getZoomAnchor()` ， `setDataLoader(loader)` ， `setSymbol(symbol)` ， `getSymbol()` ， `setPeriod(period)` ， `getPeriod()` ， `resetData()` ， `setThousandsSeparator(thousandsSeparator)` ， `getThousandsSeparator()` ， `setDecimalFold(decimalFold)` ， `getDecimalFold()` ， `getIndicators()` 和 `getOverlays()` 。
  + 样式配置新增 `candle.priceMark.last.extendTexts` ， `candle.tooltip.title` ， `candle.tooltip.legend` ， `indicator.tooltip.title` ， `indicator.tooltip.legend` ， `crosshair.horizontal.features` ， `candle.bar.compareRule` ， `indicator.ohlc.compareRule` 和 `candle.priceMark.last.compareRule` 。
  + 实例方法 `subscribeAction` 和 `unsubscribeAction` ， 入参 `type` 新增 `onIndicatorTooltipFeatureClick` 和 `onCrosshairFeatureClick` 。
+ 👉 变更
  + 图表方法 `init(dcs, options)` ， `options.layout` 子项中的 `position` 变更为 `order` ， `options.thousandsSeparator` 变更为对象 `{ sign, format }` ， `options.decimalFoldThreshold` 变更为 `options.decimalFold` ， `options.customApi` 变更为 `options.formatter` ， `formatDate` 参数变更为对象。
  + 实例方法 `setCustomApi` 变更为 `setFormatter` ， `getCustomApi` 变更为 `getFormatter` ， `getBarSpace()` 返回值变更为对象 ， `createIndicator` 返回值变更为返回指标id ， `overlayIndicator` 入参 `paneId` 合并到入参 `indicator` 中， 。
  + 自定义指标 `createTooltipDataSource` 方法返回值 `values` 变更为 `legends` ， `icons` 变更为 `features` 。
  + 样式配置 `candle.tooltip.icons` 变更为 `candle.tooltip.features` ， `indicator.tooltip.icons` 变更为 `indicator.tooltip.features` 。
+ 💄 优化
  + 优化覆盖物模版中的 `figure` 忽略事件类型，事件名和 `overlay` 中的事件名称一致。
  + 优化指标计算任务执行。
  + 优化移动端滚动事件触发。
+ 🗑 废弃
  + 图表方法删除 `utils.drawArc(ctx, arc, styles)` ，`utils.drawCircle(ctx, circle, styles)` ， `utils.drawLine(ctx, line, styles)` ，`utils.drawPolygon(ctx, polygon, styles)` ， `utils.drawRect(ctx, rect, styles)` ，`utils.drawText(ctx, text, styles)` ， `utils.drawRectText(ctx, rectText, styles)`，请使用 `getFigureClass(name)` 代替。
  + 实例方法删除 `setPriceVolumePrecision(pricePrecision, volumePrecision)` ，请使用 `setPrecision(precision)` 代替。
  + 实例api删除 `setLoadMoreData` ， `applyNewData` ， `updateData` ， 请替换为 `setDataLoader` ， 删除 `clearData` ， `setPrecision` 和 `getPrecision`。
  + 实例方法删除 `getIndicatorByPaneId(paneId, name)` ，请使用 `getIndicators(filter)` 代替。
  + 实例方法删除 `getOverlayById(id)` ，请使用 `getOverlays(filter)` 代替。
  + 实例方法 `subscribeAction` 和 `unsubscribeAction` 删除入参 `onTooltipIconClick` ，请使用 `onCandleTooltipFeatureClick` 和 `onIndicatorTooltipFeatureClick` 代替。
  + 样式配置删除 `yAxis.position` ， `yAxis.type` ， `yAxis.inside` 和 `yAxis.inside` ，请使用窗口配置 `axis` 中的属性代替。详情参阅图表API [init(dcs, options)](/api/chart/init#parameters) ，实例API [createIndicator(value, isStack, paneOptions)](/api/instance/createIndicator#parameters) 和 [setPaneOptions(options)](/api/instance/setPaneOptions#parameters) 。
  + 样式配置删除 `candle.tooltip.defaultValue` ， `candle.tooltip.custom` 请替换为 `candle.tooltip.legend` ，删除 `candle.tooltip.text` ，删除 `indicator.tooltip.showName` ， `indicator.tooltip.showParams` ，请用 `indicator.tooltip.title` ，删除 `indicator.tooltip.defaultValue` ， 请替换为 `indicator.tooltip.legend` ， 删除 `indicator.tooltip.text` ， 删除 `overlay.rectText` 。
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
