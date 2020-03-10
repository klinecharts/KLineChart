# KLineChart(English|[中文](./translate/zh-CN.md))
[![npm version](https://badgen.net/npm/v/klinecharts)](https://www.npmjs.com/package/klinecharts)
[![Build Status](https://travis-ci.org/liihuu/klineweb.svg?branch=master)](https://travis-ci.org/liihuu/klineweb)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8cc3d651f78143bf8232cb4f7bfac7c2)](https://www.codacy.com/app/liihuu/klineweb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=liihuu/klineweb&amp;utm_campaign=Badge_Grade)
[![size](https://badgen.net/bundlephobia/minzip/klinecharts@latest)](https://bundlephobia.com/result?p=klinecharts@latest)
[![types](https://badgen.net/npm/types/klinecharts)](types/index.d.ts)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

📈A kline library for browser. Support technical indicators and parameter setting, support for graphic markup, custom style.
## Browser Support
The chart is based on canvas. In theory, as long as it supports canvas, it is the same on mobile.
## Installing
Using npm:

```bash
$ npm install klinecharts
```

Using yarn:

```bash
$ yarn add klinecharts
```

## API
### klinecharts
```js
klinecharts.init(document.getElementById('divDomId'))
klinecharts.dispose(document.getElementById('divDomId'))
klinecharts.version()
```

### klinecharts instance
```js
resize()
setStyle(style)
getStyle()
setMainChartType(chartType)
setIndicatorParams(indicatorType, params)
getIndicatorParams(indicatorType)
setMainIndicatorType(indicatorType)
getMainIndicatorType()
setSubIndicatorType(indicatorType)
getSubIndicatorType()
showVolChart(true)
isShowVolChart()
setDefaultRange(range)
setMinRange(range)
setMaxRange(range)
addData(dataList, pos, noMore)
getDataList()
setPrecision(pricePrecision, volumePrecision)
clearData()
addGraphicMark(graphicMarkType)
removeAllGraphicMark()
loadMore((timestamp) => {})
getConvertPictureUrl()
```

## Data Source
Data source requires KLineData array.

The single data format is as follows:
```
{ open, close, high, low, volume, turnover, timestamp }
```

## Style Config
Used to configure the style of the chart. [Here is the details.](STYLE-CONFIG-DETAIL.md)

## Technical Indicators
<table>
    <tbody>
        <tr>
            <th>type</th>
            <th>MA</th>
            <th>VOL</th>
            <th>MACD</th>
            <th>BOLL</th>
            <th>KDJ</th>
        </tr>
        <tr>
            <th>params</th>
            <th>[5,10,30,60]</th>
            <th>[5,10,20]</th>
            <th>[12,26,9]</th>
            <th>[20]</th>
            <th>[9,3,3]</th>
        </tr>
        <tr>
           <th>type</th>
           <th>RSI</th>
           <th>BIAS</th>
           <th>BRAR</th>
           <th>CCI</th>
           <th>DMI</th>
        </tr>
        <tr>
            <th>params</th>
            <th>[6,12,24]</th>
            <th>[6,12,24]</th>
            <th>[26]</th>
            <th>[13]</th>
            <th>[14,6]</th>
        </tr>
        <tr>
            <th>type</th>
            <th>CR</th>
            <th>PSY</th>
            <th>DMA</th>
            <th>TRIX</th>
            <th>OBV</th>
        </tr>
        <tr>
            <th>params</th>
            <th>[26,10,20,40,60]</th>
            <th>[12]</th>
            <th>[10,50,10]</th>
            <th>[12,20]</th>
            <th>[30]</th>
        </tr>
        <tr>
            <th>type</th>
            <th>VR</th>
            <th>WR</th>
            <th>MTM</th>
            <th>EMV</th>
            <th>SAR</th>
        </tr>
        <tr>
            <th>params</th>
            <th>[24,30]</th>
            <th>[13,34,89]</th>
            <th>[6,10]</th>
            <th>[14,9]</th>
            <th>[2,2,20]</th>
        </tr>
    </tbody>
</table>

## Graphic Mark
**Does not support mobile.**
+ [x] Horizontal straight line
+ [x] Vertical straight line
+ [x] Straight line
+ [x] Parallel straight line
+ [x] Horizontal ray
+ [x] Vertical ray
+ [x] Ray
+ [x] Horizontal line segment
+ [x] Vertical line segment
+ [x] Line segment
+ [x] Price line
+ [x] Price channel line
+ [X] Fibonacci line

## Samples
[https://liihuu.github.io/kline](https://liihuu.github.io/kline)

## License
[MIT](./LICENSE)
