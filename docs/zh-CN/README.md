## 功能列表
+ 支持样式修改(包括各种文字和线，主图类型，坐标轴类型及位置等等)。
+ 支持设置价格和数量精度。
+ 支持时区设置。
+ 支持缩放比例设置。
+ 支持禁止滚动和缩放。
+ 支持分段加载历史数据和实时更新。
+ 技术指标
    + 内置几十种技术指标。
    + 支持主图设置多个技术指标类型。
    + 支持单独窗口展示(理论上可以创建无数个窗口)。
    + 支持为窗口设置技术指标类型。
    + 支持为单个技术指标设置精度、样式和计算参数。
    + 支持自定义且能够自行绘制。
+ 图形标记
    + 内置多种图形。
    + 支持根据鼠标动作去一步步的完成绘制。
    + 支持一步创建一个完整的图形。
    + 支持自定义。
+ 支持绘制蜡烛图和技术指标监听。
+ 支持图表生成图片导出。

## 入门
### 安装
```bash
npm install klinecharts --save
```

### 引入区分
```js
// 引入全量图表，包含全部技术指标和全部画图模型
import { init, dispose, version, extension } from 'klinecharts'

// 引入图表部分功能，只包含全部技术指标
import { init, dispose, version, extension } from 'klinecharts/index.blank'

// 引入图表基础功能，不包含技术指标和画图模型
import { init, dispose, version, extension } from 'klinecharts/index.simple'
```
以上三种方式根据需要用其中一种引入方式即可。

### 创建一个图表
```js
import { init } from 'klinecharts'
// 初始化图表
const chart = init('container_id')
// 为图表添加数据
chart.applyNewData([
  { close: 4976.16, high: 4977.99, low: 4970.12, open: 4972.89, timestamp: 1587660000000, volume: 204 },
  { close: 4977.33, high: 4979.94, low: 4971.34, open: 4973.20, timestamp: 1587660060000, volume: 194 },
  { close: 4977.93, high: 4977.93, low: 4974.20, open: 4976.53, timestamp: 1587660120000, volume: 197 },
  { close: 4966.77, high: 4968.53, low: 4962.20, open: 4963.88, timestamp: 1587660180000, volume: 28 },
  { close: 4961.56, high: 4972.61, low: 4961.28, open: 4961.28, timestamp: 1587660240000, volume: 184 },
  { close: 4964.19, high: 4964.74, low: 4961.42, open: 4961.64, timestamp: 1587660300000, volume: 191 },
  { close: 4968.93, high: 4972.70, low: 4964.55, open: 4966.96, timestamp: 1587660360000, volume: 105 },
  { close: 4979.31, high: 4979.61, low: 4973.99, open: 4977.06, timestamp: 1587660420000, volume: 35 },
  { close: 4977.02, high: 4981.66, low: 4975.14, open: 4981.66, timestamp: 1587660480000, volume: 135 },
  { close: 4985.09, high: 4988.62, low: 4980.30, open: 4986.72, timestamp: 1587660540000, volume: 76 }
])
```

## API
### 图表方法
```js
// 初始化一个图表，返回图表实例
// ds 可以是dom元素、元素id和元素class中的一种
// options 样式配置，详情可参阅样式详情
init(ds, options)

// 销毁一个图表，一旦销毁，图表将不再可用。
// dcs 可以是div节点、节点id、节点class和图表实例中的一种
dispose(dcs)

// 全局添加技术指标
extension.addTechnicalIndicator(technicalIndicator)

// 全局添加图形标记
extension.addGraphicMark(graphicMark)

// 获取图表的版本号
version()
```

### 图表实例方法
```js
// 设置样式配置
// options 样式配置，详情可参阅样式详情
setStyleOptions(options)

// 获取样式配置
getStyleOptions()

// 覆盖技术指标信息
// override 需要覆盖的一些参数
overrideTechnicalIndicator(override)

// 获取技术指标信息
// technicalIndicatorType 技术指标类型，可缺省，缺省则返回所有
getTechnicalIndicatorInfo(technicalIndicatorType)

// 设置价格和数量精度
// pricePrecision 价格精度，影响整个图表显示的价格的数字精度，还包括指标系列是price的技术指标
// volumePrecision 数量精度，影响整个图表显示的数量的数字精度，还包括指标系列是volume的技术指标
setPriceVolumePrecision(pricePrecision, volumePrecision)

// 设置时区
// timezone 时区名，如'Asia/Shanghai'
// 如果不设置会自动获取本机时区
// 时区对应名字列表请自寻查找相关文档
setTimezone(timezone)

// 获取图表时区
getTimezone()

// 调整图表大小，总是会填充容器大小
// 注意：此方法会重新计算整个图表各个模块的大小，频繁调用可能会影响到性能，调用请谨慎
resize()

// 设置是否缩放
setZoomEnabled(enabled)

// 是否可以缩放
isZoomEnabled()

// 设置是否可以拖拽滚动
setScrollEnabled(enabled)

// 是否可以拖拽滚动
isScrollEnabled()

// 设置图表右边可以空出来的间隙
setOffsetRightSpace(space)

// 设置左边最小可见的蜡烛数量
setLeftMinVisibleBarCount(barCount)

// 设置右边最小可见的蜡烛数量
setRightMinVisibleBarCount(barCount)

// 设置图表一条数据所占用的空间
setDataSpace(space)

// 添加新数据
// 此方法会清空图表数据，不需要额外调用clearData方法
// dataList 是一个KLineData数组，KLineData类型详情可参阅数据源
// more 告诉图表还有没有更多历史数据，可缺省，默认为true
applyNewData(dataList, more)

// 添加历史更多数据
// dataList 是一个KLineData数组，KLineData类型详情可参阅数据源
// more 告诉图表还有没有更多历史数据，可缺省，默认为true
applyMoreData(dataList, more)

// 更新数据
// 目前只会匹配当前最后一条数据的时间戳，相同则覆盖，不同则追加
updateData(data)

// 获取图表目前的数据源
getDataList()

// 清空数据
// 一般情况下清空数据是为了添加新的数据，为了避免重复绘制，所有这里只是清除数据，图表不会重绘
clearData()

// 设置加载更多回调函数
// cb 是一个回调方法，回调参数为第一条数据的时间戳
loadMore(cb)

// 创建一个窗口
// type 窗口类型，可缺省，目前仅支持'technicalIndicator'
// options 配置信息，可缺省，格式为：{ technicalIndicatorType: 'xxx', height: 100, dragEnabled: true }
// 返回值是一个字符串的标识，这非常重要，后续对该窗口的一些操作，都需要此标识
createPane(type, options)

// 移除窗口
// paneId 窗口id 调用createPane方法时返回的标识
removePane(paneId)

// 设置技术指标类型
// technicalIndicatorType 技术指标类型
// isStack 是否要叠加，可缺省
// paneId 调用createPane方法时返回的标识，如果缺省，则会将技术指标设置在主图上
setTechnicalIndicatorType(technicalIndicatorType, isStack, paneId)

// 获取技术指标类型
// paneId 调用createPane方法时返回的标识，如果缺省，则会获取主图上的技术指标类型
// 返回技术指标类型数组
getTechnicalIndicatorType(paneId)

// 移除技术指标
// technicalIndicatorType 技术指标类型，如果缺省，则会移除所有
// paneId 调用createPane方法时返回的标识，如果缺省，则会移除主图上的技术指标
removeTechnicalIndicator(technicalIndicatorType, paneId)

// 添加一个自定义技术指标
// technicalIndicatorInfo 技术指标信息，详细请参考自定义指标
addCustomTechnicalIndicator(technicalIndicatorInfo)

// 创建图形标记
// graphicMarkType 图形标记类型
createGraphicMark(graphicMarkType)

// 添加自定义图形标记
// graphicMark 图形标记信息
addCustomGraphicMark(graphicMark)

// 移除所有的图形标记
removeAllGraphicMark()

// 订阅绘制事件
// type类型是'drawCandle'和'drawTechnicalIndicator'
// callback 是回调方法
subscribeDrawAction(type, callback)

// 取消订阅绘制事件
// 入参同方法subscribeDrawAction
unsubscribeDrawAction(type, callback)

// 获取图表转换成图片后的图片url
// includeTooltip 是否需要提示浮层，可缺省
// includeGraphicMark, 是否需要包含图形标记层，可缺省
// type 转换后的图片类型，类型是'png'、'jpeg'、'bmp'三种中的一种，可缺省，默认为'jpeg'
// backgroundColor 背景色，可缺省，默认为'#333333'
getConvertPictureUrl(includeTooltip, includeGraphicMark, type, backgroundColor)
```

## 数据源
图表的数据源需要特定的格式，单条数据格式如下：
```js
{ open, close, high, low, volume, turnover, timestamp }
```
分别对应开盘价、收盘价、最高价、最低价、成交量、成交额、时间戳，
其中时间戳timestamp需要```毫秒```，其它的都需要```number```类型
成交额turnover字段并不是必须的，但是如果你需要展示技术指标```EMV```和```AVP```则需要为该字段填充数据。


## 技术指标
### 默认技术指标
图表默认支持技术指标如下：<br/>
`MA`, `EMA`, `SMA`, `BBI`, `VOL`, `AVP`, `MACD`,
`BOLL`, `KDJ`,`RSI`, `BIAS`, `BRAR`, `CCI`, `DMI`,
`CR`, `PSY`,`DMA`, `TRIX`, `OBV`, `VR`, `WR`, `MTM`,
`EMV`, `SAR`, `AO`, `PVT`, `ROC`

### 自定义技术指标
可以通过`extension.addTechnicalIndicator(technicalIndicator)`全局添加自定义技术指标，
也通过图表实例方法`addCustomTechnicalIndicator(technicalIndicator)`为单个图表实例添加自定义技术指标。<br/>
[如何自定义一个技术指标](custom-technical-indicator.md)


## 图形标记
### 默认图形标记
图表默认支持图形标记如下：<br/>
`horizontalRayLine`, `horizontalSegment`, `horizontalStraightLine`,
`verticalRayLine`, `verticalSegment`, `verticalStraightLine`
`rayLine`, `segment`, `straightLine`, `priceLine`,
`priceChannelLine`, `parallelStraightLine`, `fibonacciLine`

### 自定义图形标记
可以通过`extension.addGraphicMark(graphicMark)`全局添加自定义图形标记，
也通过图表实例方法`addCustomGraphicMark(graphicMark)`为单个图表实例添加自定义图形标记。<br/>
[如何自定义一个图形标记](custom-graphic-mark.md)


## 样式配置
全部配置请参阅[style](../style.md)


## 快捷键
目前仅支持移动和缩放
+ ```shift + ←``` 左移
+ ```shift + →``` 右移
+ ```shift + ↑``` 放大
+ ```shift + ↓``` 缩小

## 浏览器兼容
理论上图表能运行在任何支持canvas的浏览器上，如果遇到图表不能正常渲染，请尝试如下方案：
+ [core-js](https://github.com/zloirock/core-js)
+ [Intl.js](https://github.com/andyearnshaw/Intl.js)

引入core-js示例：
```js
import 'core-js'
import { init } from 'klinecharts'
```

引入Intl.js示例：
```js
import 'intl'
import 'intl/locale-data/jsonp/en'
import { init } from 'klinecharts'
```
注意：不管是core还是Intl都需要在图表库前引用。

## 版本日志
[CHANGELOG.md](CHANGELOG.md)

## 交流群
+ QQ: 677936660

