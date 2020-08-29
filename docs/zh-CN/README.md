## 入门
### 安装
```bash
npm install klinecharts --save
```

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
// 初始化一个图表
// ds 可以是div节点、节点id和节点class中的一种
// options 样式配置，详情可参阅样式详情
init(ds, options)

// 销毁一个图表，一旦销毁，图表将不再可用。
// dcs 可以是div节点、节点id、节点class和图表实例中的一种
dispose(dcs)

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

// 设置技术指标参数
// technicalIndicatorType 技术指标类型，类型详情可参阅技术指标
// params 技术指标计算参数，详情可参阅技术指标参数
setTechnicalIndicatorParams(technicalIndicatorType, params)

// 获取技术指标参数
// technicalIndicatorType 技术指标类型，可缺省，缺省则返回所有
getTechnicalIndicatorParams(technicalIndicatorType)

// 设置精度
// pricePrecision 价格精度，影响整个图表显示的价格的数字精度，还包括指标系列是price的技术指标
// volumePrecision 数量精度，影响整个图表显示的数量的数字精度，还包括指标系列是volume的技术指标
setPrecision(pricePrecision, volumePrecision)

// 设置技术指标精度
// precision 精度小数位数
// technicalIndicatorType 技术指标类型，可缺省，缺省则设置所有技术指标精度
setTechnicalIndicatorPrecision(precision, technicalIndicatorType)

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

// 设置蜡烛图图表类型
// 类型为'candle_stick'和'real_time'
setCandleStickChartType(chartType)

// 设置蜡烛图上的技术指标类型
// 理论上支持目前图表支持的所以技术指标
// 当设置为'NO'时将不展示
setCandleStickTechnicalIndicatorType(technicalIndicatorType)

// 创建技术指标图
// technicalIndicatorType 技术指标类型
// height 技术指标图的高度，可缺省，默认为100
// dragEnabled 技术指标图是否可以拖拽调整高度，可缺省，默认为true
// 返回值是一个字符串类型的技术指标图标识，这非常重要，后续对该图表的一些操作，都需要此标识
createTechnicalIndicator(technicalIndicatorType, height, dragEnabled)

// 添加一个自定义技术指标
// technicalIndicatorInfo 技术指标信息，详细请参考自定义指标
addCustomTechnicalIndicator(technicalIndicatorInfo)

// 设置其它技术指标图的指标类型
// technicalIndicatorType 技术指标类型，当technicalIndicatorType是不存在时，图表会移除当前技术指标图，详情类型详情可参阅技术指标
// tag 技术指标图标识
setTechnicalIndicatorType(tag, technicalIndicatorType)

// 移除技术指标图
// tag 技术指标图标识
removeTechnicalIndicator(tag)

// 添加图形标记
// 入参类型：
// 'none'，'horizontalStraightLine'，'verticalStraightLine'，'straightLine'，'horizontalRayLine'
// 'verticalRayLine'，'rayLine'，'horizontalSegmentLine'，'verticalSegmentLine'，'segmentLine'
// 'priceLine'，'priceChannelLine'，'parallelStraightLine'，'fibonacciLine'
addGraphicMark(graphicMarkType)

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
// includeFloatLayer 是否需要包含浮层, 可缺省
// includeGraphicMark, 可缺省
// type 转换后的图片类型，类型是'png'、'jpeg'、'bmp'三种中的一种，可缺省，默认为'jpeg'
// backgroundColor 背景色，可缺省，默认为'#333333'
getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor)
```

## 数据源
图表的数据源需要特定的格式，单条数据格式如下：
```js
{ open, close, high, low, volume, turnover, timestamp }
```
分别对应开盘价、收盘价、最高价、最低价、成交量、成交额、时间戳，
其中时间戳timestamp需要```毫秒```，其它的都需要```number```类型
成交额turnover字段并不是必须的，但是如果你需要展示分时图的```均线```和技术指标```EMV```则需要为该字段填充数据。


## 技术指标
### 默认技术指标
图表默认支持21种技术指标，类型及计算参数如下：
<table>
    <tbody>
        <tr>
            <th>指标类型</th>
            <th>MA</th>
            <th>EMA</th>
            <th>VOL</th>
            <th>MACD</th>
            <th>BOLL</th>
            <th>KDJ</th>
        </tr>
        <tr>
            <th>默认参数</th>
            <th>[5,10,30,60]</th>
            <th>[6,12,20]</th>
            <th>[5,10,20]</th>
            <th>[12,26,9]</th>
            <th>[20]</th>
            <th>[9,3,3]</th>
        </tr>
        <tr>
           <th>指标类型</th>
           <th>RSI</th>
           <th>BIAS</th>
           <th>BRAR</th>
           <th>CCI</th>
           <th>DMI</th>
           <th>CR</th>
        </tr>
        <tr>
            <th>默认参数</th>
            <th>[6,12,24]</th>
            <th>[6,12,24]</th>
            <th>[26]</th>
            <th>[13]</th>
            <th>[14,6]</th>
            <th>[26,10,20,40,60]</th>
        </tr>
        <tr>
            <th>指标类型</th>
            <th>PSY</th>
            <th>DMA</th>
            <th>TRIX</th>
            <th>OBV</th>
            <th>VR</th>
            <th>WR</th>
        </tr>
        <tr>
            <th>默认参数</th>
            <th>[12]</th>
            <th>[10,50,10]</th>
            <th>[12,20]</th>
            <th>[30]</th>
            <th>[24,30]</th>
            <th>[13,34,89]</th>
        </tr>
        <tr>
            <th>指标类型</th>
            <th>MTM</th>
            <th>EMV</th>
            <th>SAR</th>
        </tr>
        <tr>
            <th>默认参数</th>
            <th>[6,10]</th>
            <th>[14,9]</th>
            <th>[2,2,20]</th>
        </tr>
    </tbody>
</table>

### 自定义技术指标
通过图表api```addCustomTechnicalIndicator(technicalIndicatorInfo)```可以添加自定义技术指标。<br/>
添加后，可以像操作默认的技术指标一样去操作，比如设置计算参数。<br/>
technicalIndicatorInfo格式如下：
```
{
  // 技术指标名字，必要字段，是技术指标的唯一标识
  name: 'NAME',
  // 技术指标计算方法，必要字段
  // 该字段是一个回调方法，回调参数是当前图表的源数据和计算的参数，需要返回一个数组
  calcTechnicalIndicator: (kLineDataList, calcParams, plots) => { return [...] },
  // 精度，可缺省，默认为4
  precision: 4,
  // 技术指标系列，值为'price', 'volume'和'normal'
  // 当值为price时，价格设置价格精度时会影响该技术指标的精度
  // 当值为volume时，价格设置数量精度时会影响该技术指标的精度
  series: 'normal',
  // 计算参数，可缺省
  calcParams: [],
  // 数据信息，需要对应计算方法返回的结果里面的key值
  // 示例：
  // 如果calcTechnicalIndicator返回的结果形式是[{ a: 1, b: 2 }, { a: 5, b: 6 }]
  // 则plots应该是[{ key: 'a', type: 'line' }, { key: 'b', type: 'line' }]
  // type可以是'line'，'circle'，'bar'
  plots: [],
  // 是否需要检查计算参数，可缺省，默认为true
  // 如果为true，当设置指标参数时，如果参数个数和默认的参数个数不一致，将不能生效
  shouldCheckParamCount: true,
  // 是否需要格式化大数据值
  shouldFormatBigNumber: false,
  // 是否需要辅助ohlc线
  shouldOhlc: false,
  // 基础比对数据，可缺省
  baseValue: null,
  // 指定的最小值，可缺省
  minValue: null,
  // 指定的最大值，可缺省
  maxValue: null,
  // 自定义渲染，可缺省，
  // ctx canvas上下文
  // dataSource 数据源，包含了原始的k线数据和计算出来的指标数据以及起始绘制点位置
  // viewport 一些绘图可能需要的一些参数
  // xAxis x轴组件，包含值和坐标转换的一些方法
  // yAxis y轴组件，包含值和坐标转换的一些方法
  // isCandleStickTechnicalIndicator 是否是蜡烛图指标
  render: (
    ctx, dataSource, viewport,
    styleOptions, xAxis, yAxis,
    isCandleStickTechnicalIndicator
  ) => {}
}
```
具体可参考[TechnicalIndicator](https://github.com/liihuu/TechnicalIndicator)

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

