# Instance API

### getDom(paneId, position)
Get dom container.
- `paneId` pane id, the default is the entire chart container
- The `position` position supports `root`, `main`, `yAxis`. The default is `root`


### getSize(paneId, position)
Get size.
- `paneId` pane id, the default is the entire chart container
- The `position` position supports `root`, `main`, `yAxis`. The default is `root`


### setStyles(styles)
Set the style configuration.
- `styles` style configuration, please refer to [style details](styles.md)


### getStyles()
Get the style configuration.


### setPriceVolumePrecision(pricePrecision, volumePrecision)
Set the price and volume precision. Set the price and quantity accuracy, and the technical indicator series is'price' or'volume' will also be affected.
- `pricePrecision` price precision
- `volumePrecision` volume precision


### setTimezone(timezone)
Set the time zone.
- `timezone` Time zone name, such as'Asia/Shanghai', if it is not set, the local time zone will be automatically obtained. Please search for the relevant documents for the name list of the time zone


### getTimezone()
Get the chart time zone.


### setZoomEnabled(enabled)
Set whether to zoom.
- `enabled` true or false


### isZoomEnabled()
Can zoom.


### setScrollEnabled(enabled)
Set whether to drag and scroll.
- `enabled` true or false


### isScrollEnabled()
Whether you can drag and scroll.


### setOffsetRightDistance(distance)
Set the gap that can be left on the right side of the chart.
- `distance` Distance size


### setLeftMinVisibleBarCount(barCount)
Set the minimum number of candles visible on the left.
- `barCount` quantity


### setRightMinVisibleBarCount(barCount)
Set the minimum number of candles visible on the right.
- `barCount` number


### setBarSpace(space)
Set the space occupied by a piece of chart data, that is, the width of a single candlestick.
- `space` width


### getBarSpace()
Get the space occupied by a single piece of data on a chart.


### applyNewData(dataList, more)
Add new data, this method will clear the chart data, no need to call the clearData method.
- `dataList` is a KLineData array. For details of KLineData type, please refer to the data source
- `more` tells the chart if there are more historical data, it can be defaulted, the default is true


### applyMoreData(dataList, more)
Add more historical data.
- `dataList` is a KLineData array, please refer to the data source for details of KLineData type
- `more` tells the chart if there is more historical data, it can be the default, the default is true


### updateData(data)
Update data. Currently, only the current time stamp of the last data will be matched. If it is the same, it will be overwritten, and if it is different, it will be added.
- `data` Single bar data


### getDataList()
Get the current data source of the chart.


### clearData()
Clear chart data. Normally, clear data is to add new data. In order to avoid repeated drawing, all here is just to clear data, and the chart will not be redrawn.


### loadMore(cb)
Set to load more callback functions.
- `cb` is a callback method, the callback parameter is the timestamp of the first data


### createIndicator(value, isStack, paneOptions)
Create a technical indicator, the return value is a string that identifies the window, which is very important, and some subsequent operations on the window require this identification.
- `value` name or object, when it is an object, the type is the same as the input parameter of `overrideIndicator`
- `isStack` is covered
- `paneOptions` window configuration information, which can be defaulted, `{ id, height, minHeight, dragEnabled, gap }`
  - `id` window id, default. Special paneId: candle_pane, the window id of the main image
  - `height` The height of the pane
  - `minHeight` The min height of the pane
  - `dragEnbaled` Pane can be adjusted by dragging
  - `gap` Margins `{ top, bottom }`, can be defaulted

Example:
```javascript
chart.createIndicator('MA', false, {
  id:'pane_1',
  height: 100,
  minHeihgt: 50
  dragEnabled: true,
  gap: { top: 0.2, bottom: 0.1}
})
```


### overrideIndicator(override, paneId)
Override technical indicator information.
- `override` Some parameters that need to be overridden, `{name, shortName, calcParams, precision, shouldOhlc, shouldFormatBigNumber, extendData, series, figures, minValue, maxValue, styles, calc, regenerateFigures, createToolTipDataSource, draw}`
  - `name` Technical indicator name, required field
  - `shortName` Short indicator name, which can be defaulted
  - `calcParams` Calculation parameter, which can be defaulted
  - `precision` Precision, which can be defaulted
  - `shouldOhlc` Whether an ohlc auxiliary line is required, which can be defaulted
  - `shouldFormatBigNumber` Whether large numbers need to be formatted, which can be defaulted
  - `extendData` Extended data, which can be defaulted
  - `series` Series can be defaulted
  - `figures` Configuration information, which can be defaulted
  - `minValue` The minimum value specified, which can be defaulted
  - `maxValue` The maximum value specified, which can be defaulted
  - `styles` Style can be defaulted, and the format is consistent with the `indicator` in the style configuration
  - `calc` Calculation, which can be defaulted
  - `regenerateFigures` Regenerates the figure configuration, which can be defaulted
  - `createToolTipDataSource` Create custom prompt text, which can be defaulted
  - `draw` Custom drawing, which can be defaulted
- `paneId` Pane id is set by default

Example:
```javascript
chart.overrideIndicator({
  name: 'BOLL',
  showName: 'BOLL'
  calcParams: [20, 5.5],
  precision: 4,
  shouldOhlc: true,
  shouldFormatBigNumber: false,
  extendData: 2432435,
  series: 'price',
  figures: [],
  minValue: null,
  maxValue: null,
  calc: () => [],
  regenerateFigures: () => [],
  draw: () => {},
  styles: {
  	bars:[{
      style: 'fill,
      borderStyle: 'solid,
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    }],
    lines: [{
      size: 1,
      style: 'solid',
      dashedValue: [2, 2],
      color: '#FF9600'
    }],
    circles: [{
      style: 'fill,
      borderStyle: 'solid,
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: '#26A69A',
      downColor: '#EF5350',
      noChangeColor: '#888888'
    }]
  }
}, 'candle_pane')
```


### getIndicatorByPaneId(paneId, name)
Obtain technical indicator information according to the window id.
- `paneId` window id, which can be defaulted, and all are returned by default.
- `name` technical indicator name

Special paneId: candle_pane, the window id of the main image


### removeIndicator(paneId, name)
Remove technical indicators.
- `paneId` pane id, which is the pane id returned when the createTechnicalIndicator method is called
Special paneId: candle_pane, the window id of the main image
- `name` technical indicator type, if default, all will be removed


### createOverlay(value, paneId)
Create a overlay and return a string type identifier.
- `value` Overlay name or overlay object. When it is an object, the parameter is consistent with 'overrideOverlay'
- `paneId` pane id

Example:
```javascript
chart.createOverlay({
  name: 'segment',
  points: [
    { timestamp: 1614171282000, value: 18987 },
    { timestamp: 1614171202000, value: 16098 },
  ],
  styles: {
    line: {
      style: 'solid',
      dashedValue: [2, 2]
      color: '#f00',
      size: 2
    }
  },
  lock: false,
  mode: 'weak_magnet',
  extendData: 'xxxxxxxx',
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  onDrawStart: function (event) { console.log(event) },
  onDrawing: function (event) { console.log(event) },
  onDrawEnd: function (event) { console.log(event) },
  onClick: function (event) { console.log(event) },
  onRightClick: function (event) {
    console.log(event)
    return false
  },
  onMouseEnter: function (event) { console.log(event) },
  onMouseLeave: function (event) { console.log(event) },
  onPressedMoveStart: function (event) { console.log(event) },
  onPressedMoving: function (event) { console.log(event) },
  onPressedMoveEnd: function (event) { console.log(event) },
  onRemoved: function (event) { console.log(event) },
  onSelected: function (event) { console.log(event) },
  onDeselected: function (event) { console.log(event) }
})
```


### getOverlayById(id)
Get overlay information.
- `paneId` pane id
- `id` calls the `createOverlay` method to return the identity, by default it returns all


### overrideOverlay(override)
Override the overlay configuration.
- `override` configuration, `{name, id, points, styles, lock, mode, extendData, needDefaultPointFigure, needDefaultXAxisFigure, needDefaultYAxisFigure, onDrawStart, onDrawing, onDrawEnd, onClick, onRightClick, onPressedMoveStart, onPressedMoving, onPressedMoveEnd, onMouseEnter, onMouseLeave, onRemoved, onSelected, onDeselected}`
  - `name` Name
  - `id` Can be defaulted
  - `lock` Lock
  - `needDefaultPointFigure` Whether the figure on the default point is required
  - `needDefaultXAxisFigure` Whether the graph on the default X axis is required
  - `needDefaultYAxisFigure` Whether the graph on the default Y axis is required
  - `mode` Mode type, supports `normal`, `weak_ magnet`, `strong_ magnet`
  - `points` Point information, which can be defaulted. If specified, a graph will be drawn according to the point information
  - `extendData` Extended data, which can be defaulted
  - `styles` Style can be defaulted, and the format is consistent with the `overlay` in the style configuration
  - `onDrawStart` Draws the start callback event, which can be defaulted
  - `onDrawing` Callback event during drawing, which can be defaulted
  - `onDrawEnd` Draw the end callback event by default
  - `onClick` Click the callback event to default
  - `onRightClick` Right click the callback event. By default, a boolean type value needs to be returned. If true is returned, the built-in right-click deletion will be invalid
  - `onPressedMoveStart` Press and drag to start the callback event, which can be defaulted
  - `onPressedMoving` Press and hold the drag callback event to default
  - `onPressedMoveEnd` Press and drag to end the callback event, which can be defaulted
  - `onMouseEnter` mouse move in event, which can be defaulted
  - `onMouseLeave` mouse move out event, which can be defaulted
  - `onRemoved` Delete callback events by default
  - `onSelected` Select the callback event, which can be defaulted
  - `onDeselected` Cancel callback event, which can be defaulted

Example:
```javascript
chart.createOverlay({
  name: 'segment',
  points: [
    { timestamp: 1614171282000, value: 18987 },
    { timestamp: 1614171202000, value: 16098 },
  ],
  styles: {
    line: {
      style: 'solid',
      dashedValue: [2, 2]
      color: '#f00',
      size: 2
    }
  },
  lock: false,
  mode: 'weak_magnet',
  extendData: 'xxxxxxxx',
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  onDrawStart: function (event) { console.log(event) },
  onDrawing: function (event) { console.log(event) },
  onDrawEnd: function (event) { console.log(event) },
  onClick: function (event) { console.log(event) },
  onRightClick: function (event) {
    console.log(event)
    return false
  },
  onMouseEnter: function (event) { console.log(event) },
  onMouseLeave: function (event) { console.log(event) },
  onPressedMoveStart: function (event) { console.log(event) },
  onPressedMoving: function (event) { console.log(event) },
  onPressedMoveEnd: function (event) { console.log(event) },
  onRemoved: function (event) { console.log(event) },
  onSelected: function (event) { console.log(event) },
  onDeselected: function (event) { console.log(event) }
})
```

### removeOverlay(id)
Remove overlay.
- `id` call the `createOverlay` method is the returned mark, if the default is, all marks will be removed

Remove an html element.
- `paneId` pane id, by default delete all
- `htmlId` element id, which can be a single id or an array of ids. By default, all items on the corresponding pane are deleted.


### scrollByDistance(distance, animationDuration)
Roll a certain distance.
-`distance` distance
-`animationDuration` animation time, can be default


### scrollToRealTime(animationDuration)
Scroll to the original position.
-`animationDuration` animation time, can be default


### scrollToDataIndex(dataIndex, animationDuration)
Scroll to data index.
-`dataIndex` the index of the data
-`animationDuration` animation time, can be default

### scrollToTimestamp(timestamp, animationDuration)
Scroll to timestamp.
-`timestamp` timestamp
-`animationDuration` animation time, can be default


### zoomAtCoordinate(scale, coordinate, animationDuration)
Zoom at coordinate.
-`scale` scaling ratio
-`coordinate` coordinate point, `{ x }` can be defaulted, the default is to zoom in the middle of the chart
-`animationDuration` animation time, can be defaulted, the default is no animation


### zoomAtDataIndex(scale, dataIndex, animationDuration)
Zoom at data index.
-`scale` scaling ratio
-`dataIndex` the index of the data
-`animationDuration` animation time, can be defaulted, the default is no animation


### zoomAtTimestamp(scale, timestamp, animationDuration)
Zoom at timestamp.
-`scale` scaling ratio
-`timestamp` timestamp
-`animationDuration` animation time, can be defaulted, the default is no animation


### setPaneOptions(options)
Set pane options.
- `options` Pane configuration information, which can be defaulted, `{ id, height, minHeight, dragEnabled, gap }`
  - `id` Pane id, default. Special paneId: candle_pane, the window id of the main image
  - `height` The height of the pane
  - `minHeight` The min height of the pane
  - `dragEnbaled` Pane can be adjusted by dragging
  - `gap` Margins `{ top, bottom }`, can be defaulted
Example:
```javascript
chart.setPaneOptions({
  id: 'pane_1',
  height: 100,
  minHeight: 30,
  dragEnabled: true,
  gap: { top: 0.2, bottom: 0.1 }
})
```


### subscribeAction(type, callback)
Subscribe to chart actions.
- `type` Type is `onZoom`, `onScroll`, `onCrosshairChange`, and `onPaneDrag`
- `callback` Is a callback method


### unsubscribeAction(type, callback)
Unsubscribe from chart actions.
- `type` Type is `onZoom`, `onScroll`, `onCrosshairChange`, and `onPaneDrag`
- `callback` Callback method when subscribing


### convertToPixel(value, finder)
Convert value to coordinate value.
- `value` value, `{ timestamp, dataIndex, value }`
- `finder` finder value, `{ paneId, absolute }`


### convertFromPixel(coordinate, finder)
Convert coordinate value to value.
- `coordinate` Coordinate, `{ x, y }`
- `finder` Finder value, `{ paneId, absolute }`


### getConvertPictureUrl(includeOverlay, type, backgroundColor)
Get the picture url after the chart is converted into a picture.
- `includeOverlay` Whether to include overlay, it can be defaulted
- `type` The converted picture type. The type is one of three types: 'png', 'jpeg', and 'bmp', which can be defaulted, and the default is 'jpeg'
- `backgroundColor` Background color, can be the default, the default is '#FFFFFF'


### resize()
Resizing the chart will always fill the container size.
Note: This method will recalculate the size of each module of the entire chart. Frequent calls may affect performance. Please be cautious when calling
