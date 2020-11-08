## Getting started
### Installation
```bash
npm install klinecharts --save
```

### Create your first chart
```js
import { init } from 'klinecharts'
// init
const chart = init('container_id')
// Add data
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
### Chart
```js
init(ds, options)
dispose(dcs)
version()
```

### Chart instance
```js
setStyleOptions(options)
getStyleOptions()
setTechnicalIndicatorParams(technicalIndicatorType, params)
getTechnicalIndicatorParams(technicalIndicatorType)
setPrecision(pricePrecision, volumePrecision)
setTechnicalIndicatorPrecision(precision, technicalIndicatorType)
setTimezone(timezone)
getTimezone()
resize()
setOffsetRightSpace(space)
setLeftMinVisibleBarCount(barCount)
setRightMinVisibleBarCount(barCount)
setDataSpace(space)
applyNewData(dataList, more)
applyMoreData(dataList, more)
updateData(data)
getDataList()
clearData()
loadMore(cb)
setCandleStickChartType(chartType)
setCandleStickTechnicalIndicatorType(technicalIndicatorType)
createTechnicalIndicator(technicalIndicatorType, height, dragEnabled)
addCustomTechnicalIndicator(technicalIndicatorInfo)
setTechnicalIndicatorType(tag, technicalIndicatorType)
removeTechnicalIndicator(tag)
addGraphicMark(graphicMarkType)
removeAllGraphicMark()
subscribeDrawAction(type, callback)
unsubscribeDrawAction(type, callback)
getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor)
```

## Data source
The chart data source needs a specific format, and the single data format is as follows：
```js
{ open, close, high, low, volume, turnover, timestamp }
```
The timestamp needs ```milliseconds```, others need the ```number``` type,
The turnover field is not necessary, but if you need to display the ```moving average``` of the time-sharing chart and the technical indicator ```EMV```,
you need to fill in the data for this field.

## Technical indicator
### Default
The chart supports 21 technical indicators, the following are the types and calculation parameters:
<table>
    <tbody>
        <tr>
            <th>Type</th>
            <th>MA</th>
            <th>EMA</th>
            <th>VOL</th>
            <th>MACD</th>
            <th>BOLL</th>
            <th>KDJ</th>
        </tr>
        <tr>
            <th>Parameters</th>
            <th>[5,10,30,60]</th>
            <th>[6,12,20]</th>
            <th>[5,10,20]</th>
            <th>[12,26,9]</th>
            <th>[20]</th>
            <th>[9,3,3]</th>
        </tr>
        <tr>
           <th>Type</th>
           <th>RSI</th>
           <th>BIAS</th>
           <th>BRAR</th>
           <th>CCI</th>
           <th>DMI</th>
           <th>CR</th>
        </tr>
        <tr>
            <th>Parameters</th>
            <th>[6,12,24]</th>
            <th>[6,12,24]</th>
            <th>[26]</th>
            <th>[13]</th>
            <th>[14,6]</th>
            <th>[26,10,20,40,60]</th>
        </tr>
        <tr>
            <th>Type</th>
            <th>PSY</th>
            <th>DMA</th>
            <th>TRIX</th>
            <th>OBV</th>
            <th>VR</th>
            <th>WR</th>
        </tr>
        <tr>
            <th>Parameters</th>
            <th>[12]</th>
            <th>[10,50,10]</th>
            <th>[12,20]</th>
            <th>[30]</th>
            <th>[24,30]</th>
            <th>[13,34,89]</th>
        </tr>
        <tr>
            <th>Type</th>
            <th>MTM</th>
            <th>EMV</th>
            <th>SAR</th>
        </tr>
        <tr>
            <th>Parameters</th>
            <th>[6,10]</th>
            <th>[14,9]</th>
            <th>[2,2,20]</th>
        </tr>
    </tbody>
</table>

### Custom
Through the chart api ```addCustomTechnicalIndicator(technicalIndicatorInfo)```, you can add custom technical indicators.<br/>
After adding, you can operate like the default technical indicators, such as setting calculation parameters.<br/>
The technicalIndicatorInfo format is as follows:
```
{
  name: 'NAME',
  calcTechnicalIndicator: (kLineDataList, calcParams, plots) => { return [...] },
  precision: 4,
  series: 'normal',
  calcParams: [],
  plots: [],
  shouldCheckParamCount: true,
  shouldOhlc: false,
  shouldFormatBigNumber: false,
  baseValue: null,
  minValue: null,
  maxValue: null,
  render: (
    ctx, dataSource, viewport,
    styleOptions, xAxis, yAxis,
    isCandleStickTechnicalIndicator
  ) => {}
}
```
Specific reference [TechnicalIndicator](https://github.com/liihuu/TechnicalIndicator).

## Style Option
For full configuration please see [here](../style.md).


## Browser Compatible
In theory, the chart can run on any browser that supports canvas. If the chart cannot be rendered normally, try the following scheme:
+ [core-js](https://github.com/zloirock/core-js)
+ [Intl.js](https://github.com/andyearnshaw/Intl.js)

Introduce core-js example：
```js
import 'core-js'
import { init } from 'klinecharts'
```
Introduce Intl.js example：
```js
import 'intl'
import 'intl/locale-data/jsonp/en'
import { init } from 'klinecharts'
```
Note: Both core and Intl need to be referenced in the chart library.


## Hot Key
Currently only supports moving and zooming.
+ ```shift + ←``` shift left
+ ```shift + →``` shift right
+ ```shift + ↑``` zoom out
+ ```shift + ↓``` zoom in

## Change Log
[CHANGELOG.md](CHANGELOG.md)

