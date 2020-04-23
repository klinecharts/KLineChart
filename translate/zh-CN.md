# k线图（[English](../README.md)|中文）
基于html5 canvas构建，图表支持21种技术指标，支持自定义指标参数，支持绘制标记图形，支持自定义样式。

## 技术指标
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
[查看配置详情。](../STYLE-CONFIG-DETAIL.md)

## API
### klinecharts方法
```js
// 实例化一个图表
klinecharts.init(document.getElementById('divDomId'))
// 销毁图表
klinecharts.dispose(document.getElementById('divDomId'))
// 当前版本
klinecharts.version()
```

### klinecharts实例方法
```js
// 设置样式配置
setStyleOptions(options)
// 获取图表当前样式配置
getStyleOptions()
// 设置技术指标参数
setTechnicalIndicatorParams(technicalIndicatorType, params)
// 获取技术指标参数
getTechnicalIndicatorParamOptions()
// 设置精度
setPrecision(pricePrecision, volumePrecision)
// 设置时区，如：'Asia/Shanghai'
// 如果不设置会自动获取本机时区
// 时区配置请自寻查找相关文档
setTimezone(timezone)
// 调整图表大小，总是会填充容器大小
resize()
// 设置图表右边可以空出来的间隙
setOffsetRightSpace(space)
// 设置左边最小可见的蜡烛数量
setLeftMinVisibleBarCount(barCount)
// 设置右边最小可见的蜡烛数量
setRightMinVisibleBarCount(barCount)
// 设置图表一条数据所占用的空间
setDataSpace(space)
// 清空数据
clearData()
// 获取数据源
getDataList()
// 添加新数据, more是告诉图表还有没有更多历史数据
applyNewData(dataList, more)
// 添加历史更多数据
applyMoreData(dataList, more)
// 更新数据
updateData(data)
// 设置加载更多回调函数
loadMore(cb)
// 设置蜡烛图图表类型
// 类型为'candle_stick'和'real_time'
setCandleStickChartType(chartType)
// 设置蜡烛图上的技术指标类型
setCandleStickTechnicalIndicatorType(technicalIndicatorType)
// 设置其它技术指标图的指标类型
// 技术指标参数类型：
// 'NO'，'MA'，'EMA'，'VOL'，'MACD'，'BOLL'，'KDJ'，'RSI'，
// 'BIAS'，'BRAR'，'CCI'，'DMI'，'CR'，'PSY'，'DMA'，'TRIX'，
// 'OBV'，'VR'，'WR'，'MTM'，'EMV'，'SAR'
// tag 是创建图的返回的一个标识
setTechnicalIndicatorType(tag, technicalIndicatorType)
// 添加技术指标图，返回图表的标识
addTechnicalIndicator(technicalIndicatorType, height)
// 移除技术指标图
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
getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type)
```

## 数据源
每一条数据是需要包含open, close, high, low, volume, turnover, timestamp的对象，
分别是开盘价，收盘价，最高价，最低价，成交量，成交额，时间戳，
如果不需要分时图的成交均价线，可以不需要turnover字段。

## 图形标记
标记图形类型支持：
水平直线（horizontalStraightLine）、垂直直线（verticalStraightLine）、
直线（straightLine）、水平射线（horizontalRayLine）、
垂直射线（verticalRayLine）、射线（rayLine）、
水平线段（horizontalSegmentLine）、垂直线段（verticalSegmentLine）、
线段（segmentLine）、价格线（priceLine）、
价格通道线（priceChannelLine）、平行线（parallelStraightLine）、
斐波那契线（fibonacciLine）

## 交流群
+ QQ: 677936660
