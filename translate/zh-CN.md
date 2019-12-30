# Web端K线插件（[English](../README.md)|中文）
图表支持20种技术指标，支持自定义指标参数，支持绘制标记图形，支持自定义样式。

## 技术指标
<table>
    <tbody>
        <tr>
            <th>指标类型</th>
            <th>MA</th>
            <th>VOL</th>
            <th>MACD</th>
            <th>BOLL</th>
            <th>KDJ</th>
        </tr>
        <tr>
            <th>默认参数</th>
            <th>[5,10,30,60]</th>
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
        </tr>
        <tr>
            <th>默认参数</th>
            <th>[6,12,24]</th>
            <th>[6,12,24]</th>
            <th>[26]</th>
            <th>[13]</th>
            <th>[14,6]</th>
        </tr>
        <tr>
            <th>指标类型</th>
            <th>CR</th>
            <th>PSY</th>
            <th>DMA</th>
            <th>TRIX</th>
            <th>OBV</th>
        </tr>
        <tr>
            <th>默认参数</th>
            <th>[26,10,20,40,60]</th>
            <th>[12]</th>
            <th>[10,50,10]</th>
            <th>[12,20]</th>
            <th>[30]</th>
        </tr>
        <tr>
            <th>指标类型</th>
            <th>VR</th>
            <th>WR</th>
            <th>MTM</th>
            <th>EMV</th>
            <th>SAR</th>
        </tr>
        <tr>
            <th>默认参数</th>
            <th>[24,30]</th>
            <th>[13,34,89]</th>
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
klinecharts.init(document.getElementById('div'))
// 当前版本
klinecharts.version()
```

### klinecharts实例方法
```js
// 调整图表大小，总是会填充容器大小
resize()
// 设置图表样式
setStyle(style)
// 获取图表当前样式配置
getStyle()
// 设置图表类型，类型为'candle'和'real_time'
setMainChartType(chartType)
// 设置指标参数
setIndicatorParams(indicatorType, params)
// 获取指标参数
getIndicatorParams(indicatorType)
// 设置主图指标类型(具体类型可参考types/index.d.ts文件里面的IndicatorType)
setMainIndicatorType(indicatorType)
// 获取主图指标类型
getMainIndicatorType()
// 设置副图指标类型(类型参考同主图指标类型)
setSubIndicatorType(indicatorType)
// 获取副图指标类型
getSubIndicatorType()
// 显示成交图
showVolChart(true)
// 获取当前成交图的显示状态
isShowVolChart()
// 设置默认的一屏显示的数据个数
setDefaultRange(range)
// 设置一屏显示的最小数据个数
setMinRange(range)
// 设置一屏显示的最大数据个数
setMaxRange(range)
// 添加数据
// pos是告诉图表数据添加的位置，默认为添加到现有数据最后
// noMore是告诉图表没有更多数据，默认是false
addData(dataList, pos, noMore)
// 获取图表当前的数据
getDataList()
// 清空图表当前数据
clearData()
// 绘制标记图形(入参类型可参考types/index.d.ts文件里面的MarkerType)
drawMarker(markerType)
// 清空所有标记图形
clearAllMarker()
// 获取当前图表装换成图片的url
getConvertPictureUrl()
// 加载更多
loadMore((timestamp) => {})
```

## 图形标记
标记图形类型支持：
水平直线（horizontalStraightLine）、垂直直线（verticalStraightLine）、
直线（straightLine）、水平射线（horizontalRayLine）、
垂直射线（verticalRayLine）、射线（rayLine）、
水平线段（horizontalSegmentLine）、垂直线段（verticalSegmentLine）、
线段（segmentLine）、价格线（priceLine）、
价格通道线（priceChannelLine）、平行线（parallelStraightLine）、
斐波那契线（fibonacciLine）
