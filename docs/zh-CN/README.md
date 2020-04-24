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

// 获取所有技术指标参数
getTechnicalIndicatorParamOptions()

// 设置精度
// pricePrecision 价格精度，影响整个图表显示的价格的数字精度，还包括技术指标MA, EMA, BOLL, SAR，不包括y轴刻度值
// volumePrecision 数量精度，影响整个图表显示的价格的数字精度，还包括技术指标VOL，不包括y轴刻度值
setPrecision(pricePrecision, volumePrecision)

// 设置时区
// timezone 时区名，如'Asia/Shanghai'
// 如果不设置会自动获取本机时区
// 时区对应名字列表请自寻查找相关文档
setTimezone(timezone)

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
// 一般来说，只是设置'NO'，'MA'，'EMA'，'BOLL'，'SAR'，当设置为'NO'时将不展示
setCandleStickTechnicalIndicatorType(technicalIndicatorType)

// 添加技术指标图
// technicalIndicatorType 技术指标类型，详情参阅技术指标，可缺省，默认为'MACD'
// height 技术指标图的高度，可缺省，默认为100
// 返回值是一个字符串类型的技术指标图标识，这非常重要，后续对该图表的一些操作，都需要此标识
addTechnicalIndicator(technicalIndicatorType, height)

// 设置其它技术指标图的指标类型
// technicalIndicatorType 技术指标类型，当technicalIndicatorType是'NO'时，图表会移除当前技术指标图，详情类型详情可参阅技术指标
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

// 获取图表转换成图片后的图片url
// includeFloatLayer 是否需要包含浮层, 可缺省
// includeGraphicMark, 可缺省
// type 转换后的图片类型，类型是'png'、'jpeg'、'bmp'三种中的一种，可缺省，默认为'jpeg'
getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type)
```

## 数据源
图表的数据源需要特定的格式，单条数据格式如下：
```js
{ open, close, high, low, volume, turnover, timestamp }
```
字段turnover可缺省

## 技术指标
图表目前支持21种技术指标，类型及计算参数如下：
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

## 样式配置
全部配置请参阅[style](../style.md)


## 快捷键
目前仅支持移动和缩放
+ ```shift + ←``` 左移
+ ```shift + →``` 右移
+ ```shift + ↑``` 放大
+ ```shift + ↓``` 缩小

## 交流群
+ QQ: 677936660

