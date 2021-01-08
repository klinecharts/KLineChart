# Features
+ Support style modification (including various text and lines, main image type, coordinate axis type and position, etc.).
+ Support setting price and quantity precision.
+ Support time zone setting.
+ Support zoom ratio setting.
+ Support prohibiting scrolling and zooming.
+ Support segmented loading historical data and real-time update.
+ Technical indicators
     + Built-in dozens of technical indicators.
     + Support the main chart to set multiple technical indicator types.
     + Support single window display (theoretically, countless windows can be created).
     + Support setting technical indicator types for windows.
     + Support setting precision, style and calculation parameters for a single technical indicator.
     + Support customization and can draw by yourself.
+ Graphic mark
     + Built-in a variety of graphics.
     + Support drawing step by step according to mouse actions.
     + Support to create a complete graph in one step.
     + Support customization.
+ Support drawing candle chart and technical indicator monitoring.
+ Support chart generation and image export.

## Getting started
### Installation
```bash
npm install klinecharts --save
```

### Import distinction
```js
// Import all charts, including all technical indicators and all drawing models
import { init, dispose, version, extension } from 'klinecharts'

// Import some functions of the chart, only including all technical indicators
import { init, dispose, version, extension } from 'klinecharts/index.blank'

// Import chart basic functions, excluding technical indicators and drawing models
import { init, dispose, version, extension } from 'klinecharts/index.simple'
```
The above three methods can be introduced by one of them as needed.

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
// Initialize a chart and return the chart instance
// ds can be one of dom element, element id and element class
// options style configuration, please refer to style details for details
init(ds, options)

// Destroy a chart. Once destroyed, the chart will no longer be available.
// dcs can be one of div node, node id, node class and chart instance
dispose(dcs)

// Add technical indicators global
extension.addTechnicalIndicator(technicalIndicator)

// Add graphic marker global
extension.addGraphicMark(graphicMark)

// Get the version of the chart
version()
```

### Chart instance
```js
// Set style configuration
// options: style configuration, please refer to style details for details
setStyleOptions(options)

// Get style configuration
getStyleOptions()

// Cover technical indicator information
// override: some parameters that need to be overridden
overrideTechnicalIndicator(override)

// Get technical indicator information
// technicalIndicatorType: The type of technical indicator, which can be defaulted. The default is to return all
getTechnicalIndicatorInfo(technicalIndicatorType)

// Set price and quantity precision
// pricePrecision: price precision, which affects the digital precision of the price displayed on the entire chart, and also includes the technical indicator of price
// volumePrecision: quantity precision, which affects the numerical precision of the quantity displayed on the entire chart, and also includes the technical index of the volume where the indicator series is volume
setPriceVolumePrecision(pricePrecision, volumePrecision)

// set time zone
// timezone: time zone name, such as'Asia/Shanghai'
// If not set, the local time zone will be automatically obtained
// Please search for related documents for the list of names corresponding to the time zone
setTimezone(timezone)

// Get the chart time zone
getTimezone()

// Set whether to zoom
setZoomEnabled(enabled)

// Get whether it can be zoomed
isZoomEnabled()

// Set whether to scroll
setScrollEnabled(enabled)

// Get whether it can be scrolled
isScrollEnabled()

// Resize the chart, it will always fill the container size
// Note: This method will recalculate the size of each module of the entire chart. Frequent calls may affect performance. Please be cautious when calling
resize()

// Set the gap that can be vacated on the right side of the chart
setOffsetRightSpace(space)

// Set the minimum number of visible candles on the left
setLeftMinVisibleBarCount(barCount)

// Set the minimum number of visible candles on the right
setRightMinVisibleBarCount(barCount)

// Set the space occupied by a piece of data in the chart
setDataSpace(space)

// Add new data
// This method will clear the chart data, no need to call the clearData method
// dataList: is an array of KLineData, please refer to data source for details of KLineData type
// more: tells the chart if there are more historical data, can be the default, the default is true
applyNewData(dataList, more)

// Add more history data
// dataList: is an array of KLineData, please refer to data source for details of KLineData type
// more: tells the chart if there are more historical data, can be the default, the default is true
applyMoreData(dataList, more)

// Update data
// Currently only the timestamp of the current last piece of data will be matched, the same will be overwritten, and the difference will be appended
updateData(data)

// Get the current data source of the chart
getDataList()

// Clear data
// Under normal circumstances, clearing the data is to add new data, in order to avoid repeated drawing, all here is just to clear the data, the chart will not be redrawn
clearData()

// Set to load more callback functions
// cb: is a callback method, the callback parameter is the timestamp of the first data
loadMore(cb)

// Set the type of technical indicators
// technicalIndicatorType: technical indicator type
// isStack: whether to stack or not, can be the default
// paneId: is the identifier returned when the createPane method is called. If it is defaulted, the technical indicators will be set on the main chart
setTechnicalIndicatorType(technicalIndicatorType, isStack, paneId)

// Get the type of technical indicators
// paneId: is the identifier returned when the createPane method is called. If it is defaulted, the technical indicator type on the main chart will be obtained
// Return an array of technical indicator types
getTechnicalIndicatorType(paneId)

// Create a window
// type: window type, can be defaulted, currently only supports'technicalIndicator'
// options: configuration information, can be defaulted, the format is: {technicalIndicatorType:'xxx', height: 100, dragEnabled: true}
// The return value is a string identifier, which is very important, and some subsequent operations on the window require this identifier
createPane(type, options)

// Remove window
// paneId: window id is the identifier returned when the createPane method is called
removePane(paneId)

// Add a custom technical indicator
// technicalIndicatorInfo: technical indicator information, please refer to custom indicators for details
addCustomTechnicalIndicator(technicalIndicatorInfo)

// Remove technical indicators
// technicalIndicatorType: technical indicator type, if default, all will be removed
// paneId: is the identifier returned when the createPane method is called. If it is defaulted, the technical indicators on the main chart will be removed
removeTechnicalIndicator(technicalIndicatorType, paneId)

// Create graphic mark
// graphicMarkType: graphic mark type
createGraphicMark(graphicMarkType)

// Add custom graphic mark
// graphicMark: graphic mark information
addCustomGraphicMark(graphicMark)

// Remove all graphic marks
removeAllGraphicMark()

// Subscribe to drawing events
// type: is'drawCandle' and 'drawTechnicalIndicator'
// callback: is the callback method
subscribeDrawAction(type, callback)

// Unsubscribe to drawing events
// type: is'drawCandle' and 'drawTechnicalIndicator'
// callback: is the callback method
unsubscribeDrawAction(type, callback)

// Get the picture url after the chart is converted into a picture
// includeTooltip: whether to prompt the floating layer, it can be defaulted
// includeGraphicMark: whether you need to include the graphic mark layer, can be default
// type: The type of the converted picture, the type is one of the three types of'png','jpeg', and'bmp', which can be defaulted, and the default is'jpeg'
// backgroundColor: background color, can be the default, the default is'#333333'
getConvertPictureUrl(includeFloatLayer, includeGraphicMark, type, backgroundColor)
```

## Data source
The chart data source needs a specific format, and the single data format is as follows：
```js
{ open, close, high, low, volume, turnover, timestamp }
```
The timestamp needs `milliseconds`, others need the `number` type,
The `turnover` field is not necessary, but if you need to display the technical indicator `EMV` and `AVP`,
you need to fill in the data for this field.

## Technical indicator
### Default
The chart supports the following technical indicators by default:<br/>
`MA`, `EMA`, `SMA`, `BBI`, `VOL`, `AVP`, `MACD`,
`BOLL`, `KDJ`,`RSI`, `BIAS`, `BRAR`, `CCI`, `DMI`,
`CR`, `PSY`,`DMA`, `TRIX`, `OBV`, `VR`, `WR`, `MTM`,
`EMV`, `SAR`, `AO`, `PVT`, `ROC`

### Custom technical indicators
You can add custom technical indicators global through `extension.addTechnicalIndicator(technicalIndicator)`,
also add custom technical indicators to a single chart instance through the chart instance method `addCustomTechnicalIndicator(technicalIndicator)`.<br/>
[How to customize a technical indicator](custom-technical-indicator.md)


## Graphic mark
### Default
The chart supports graphic mark as follows by default:<br/>
`horizontalRayLine`, `horizontalSegment`, `horizontalStraightLine`,
`verticalRayLine`, `verticalSegment`, `verticalStraightLine`
`rayLine`, `segment`, `straightLine`, `priceLine`,
`priceChannelLine`, `parallelStraightLine`, `fibonacciLine`

### Custom graphic mark
You can add custom graphic marks global through `extension.addGraphicMark(graphicMark)`,
also add a custom graphic mark to a single chart instance through the chart instance method `addCustomGraphicMark(graphicMark)`.<br/>
[How to customize a graphic mark](custom-graphic-mark.md)

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

