# 📠 更新日志

## 10.0.1
`2026-08-01`
+ 💄 优化移动端惯性滚动，使滚动动画更平滑、稳定。
+ 💄 优化移动端触摸事件处理，避免拖动图表时触发页面滚动或浏览器导航手势。
+ 💄 优化面积图涟漪动画的状态和生命周期管理。
+ 💄 优化 Canvas 的渲染调度、尺寸变化和设备像素比处理。
+ 🐞 修复内置指标 `PVT` 的计算公式错误。
+ 🐞 修复 `rgbToHex` 转换绿色和蓝色通道时错误使用红色通道值的问题。
+ 🐞 修复 `hsla` 颜色校验和透明色判断中的正则表达式错误。
+ 🐞 修复部分环境下类型声明文件构建失败的问题。


## 10.0.0
`2026-07-11`

当前 10.x 版本相对 9.x 是一次主要版本升级，重点调整了数据接入、布局配置、坐标轴、指标、覆盖物、格式化和样式配置。

### 新特性
+ 🆕 支持多 y 轴。同一窗口可以创建多个 y 轴，指标可以通过 `indicator.yAxisId` 绑定到指定 y 轴。
+ 🆕 新增实例方法 `createYAxis(yAxis)`、`removeYAxis(filter)`、`getYAxes(filter)`、`overrideYAxis(options)` 和 `overrideXAxis(options)`。
+ 🆕 支持自定义快捷键，新增 `hotkey` 初始化配置以及 `setHotkey`、`getHotkey`、`registerHotkey`、`getSupportedHotkeys` 等 API。
+ 🆕 覆盖物支持连续绘制模式，内置覆盖物新增 `brush`。
+ 🆕 支持千分符和小数 0 折叠自定义，新增 `thousandsSeparator`、`decimalFold` 配置以及对应实例 API。
+ 🆕 支持设置缩放锚点，新增 `zoomAnchor` 配置以及 `setZoomAnchor(anchor)`、`getZoomAnchor()`。
+ 🆕 支持通过 `setDataLoader(loader)` 统一接入历史数据、实时数据和向前加载数据。
+ 🆕 支持通过 `setSymbol(symbol)`、`getSymbol()`、`setPeriod(period)`、`getPeriod()` 管理当前标的和周期。
+ 🆕 支持在 x 轴显示未来时间。
+ 🆕 支持移动端拖动 y 轴。
+ 🆕 支持在同一窗口创建多个相同名称的指标。
+ 🆕 重写坐标轴模块，自定义 y 轴支持自定义取值范围和分割信息。
+ 🆕 指标图形新增 `text` 类型，指标 `figures` 可以直接绘制文本。
+ 🆕 新增实例方法 `getIndicators(filter)` 和 `getOverlays(filter)` 用于按条件查询指标和覆盖物。
+ 🆕 新增样式配置 `candle.priceMark.last.extendTexts`、`candle.tooltip.title`、`candle.tooltip.legend`、`indicator.tooltip.title`、`indicator.tooltip.legend`、`crosshair.horizontal.features`、`candle.bar.compareRule`、`indicator.ohlc.compareRule` 和 `candle.priceMark.last.compareRule`。
+ 🆕 实例方法 `subscribeAction` 和 `unsubscribeAction` 的事件类型新增 `onIndicatorTooltipFeatureClick` 和 `onCrosshairFeatureClick`。

### 变更
+ 👉 图表方法 `init(ds, options)` 的 `options.layout` 调整为默认布局配置对象：
  + `layout.barSpaceLimit` 配置柱间距限制。
  + `layout.pane` 配置默认窗口属性。
  + `layout.yAxis` 配置默认 y 轴属性。
+ 👉 实例方法 `createIndicator(indicator, options?)` 调整为 `createIndicator(indicator, isStack?)`。指标所在窗口通过 `indicator.paneId` 指定，绑定的 y 轴通过 `indicator.yAxisId` 指定。
+ 👉 `setPaneOptions(options)` 只负责窗口自身属性，坐标轴配置请使用 `overrideXAxis(options)`、`overrideYAxis(options)` 或多 y 轴相关 API。
+ 👉 `convertToPixel(value, filter?)` 和 `convertFromPixel(coordinate, filter?)` 的 `filter` 新增 `yAxisId`。
+ 👉 `options.customApi` 变更为 `options.formatter`，`setCustomApi` 变更为 `setFormatter`，`getCustomApi` 变更为 `getFormatter`。
+ 👉 `formatDate(dateTimeFormat, timestamp, format, type)` 变更为 `formatDate({ dateTimeFormat, timestamp, template, type })`。
+ 👉 `options.thousandsSeparator` 由简单配置变更为对象 `{ sign, format }`。
+ 👉 `options.decimalFoldThreshold` 变更为 `options.decimalFold`。
+ 👉 `getBarSpace()` 返回值由单值变更为对象。
+ 👉 `createIndicator` 返回值变更为指标 id。
+ 👉 自定义指标 `calc` 返回值由数组变更为以时间戳为 key 的对象。
+ 👉 自定义指标 `createTooltipDataSource` 返回值中 `values` 变更为 `legends`，`icons` 变更为 `features`。
+ 👉 样式配置 `candle.tooltip.icons` 变更为 `candle.tooltip.features`，`indicator.tooltip.icons` 变更为 `indicator.tooltip.features`。
+ 👉 内置指标 `RSI` 计算逻辑调整。

### 移除
+ 🗑 删除 `utils.drawArc`、`utils.drawCircle`、`utils.drawLine`、`utils.drawPolygon`、`utils.drawRect`、`utils.drawText` 和 `utils.drawRectText`，请使用 `getFigureClass(name)` 获取图形类。
+ 🗑 删除实例方法 `setPriceVolumePrecision(pricePrecision, volumePrecision)`，请使用 `setSymbol(symbol)` 中的精度配置。
+ 🗑 删除实例方法 `setLoadMoreData`、`applyNewData`、`applyMoreData`、`updateData`、`setLoadDataCallback` 和 `loadMore`，请使用 `setDataLoader(loader)`。
+ 🗑 删除实例方法 `clearData()`，请使用 `resetData()` 重新加载数据。
+ 🗑 删除实例方法 `getIndicatorByPaneId(paneId, name)`，请使用 `getIndicators(filter)`。
+ 🗑 删除实例方法 `getOverlayById(id)`，请使用 `getOverlays(filter)`。
+ 🗑 删除 `subscribeAction` 和 `unsubscribeAction` 中的 `onTooltipIconClick`，请使用 `onCandleTooltipFeatureClick` 和 `onIndicatorTooltipFeatureClick`。
+ 🗑 删除样式配置 `yAxis.position`、`yAxis.type` 和 `yAxis.inside`，请使用 `init` 的 `layout.yAxis` 默认配置或实例 y 轴 API。
+ 🗑 删除样式配置 `candle.tooltip.defaultValue`、`candle.tooltip.custom`、`candle.tooltip.text`、`indicator.tooltip.showName`、`indicator.tooltip.showParams`、`indicator.tooltip.defaultValue`、`indicator.tooltip.text` 和 `overlay.rectText`。
+ 🗑 删除内置基础图形 `rectText`，请使用 `text`。

### 修复与优化
+ 🐞 修复覆盖物锁定状态下，事件落在覆盖物上时无法滚动图表的问题。
+ 🐞 修复强制结束绘制的覆盖物无法通过 `createOverlay` 恢复的问题。
+ 🐞 修复覆盖物弱磁模式下绘制响应问题。
+ 🐞 修复向后加载数据可能无限触发数据请求回调的问题。
+ 🐞 修复 `resize` 可能不生效的问题。
+ 🐞 修复实例 API `setZoomAnchor` 参数类型错误。
+ 💄 图表支持容器尺寸自动监听和自动 `resize()`。
+ 💄 优化覆盖物模版中 `figure` 的事件忽略类型，使事件名和 `overlay` 中的事件名称一致。
+ 💄 优化指标计算任务执行。
+ 💄 优化移动端滚动事件触发。
+ 💄 优化构建流程，构建工具由 Rollup 调整为 Vite，并新增 `type-check` 校验。

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
