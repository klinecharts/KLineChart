# Instance API

### getWidth()
Get chart width.


### getHeight()
Get chart height.


### setStyleOptions(options)
Set the style configuration.
- `options` style configuration, please refer to [style details](styles.md)


### getStyleOptions()
Get the style configuration.


### setPriceVolumePrecision(pricePrecision, volumePrecision)
Set the price and quantity precision.
- `pricePrecision` price accuracy, which affects the numerical accuracy of the price displayed on the entire chart, and also includes the technical indicator whose indicator series is price
- `volumePrecision` quantity accuracy, which affects the numerical accuracy of the quantity displayed on the entire chart, and also includes the technical index of the volume where the indicator series is


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


### setOffsetRightSpace(space)
Set the gap that can be left on the right side of the chart.
- `space` Distance size, number type


### setLeftMinVisibleBarCount(barCount)
Set the minimum number of candles visible on the left.
- `barCount` quantity, number type


### setRightMinVisibleBarCount(barCount)
Set the minimum number of candles visible on the right.
- `barCount` number, number type


### setDataSpace(space)
Set the space occupied by a piece of chart data, that is, the width of a single candlestick.
- `space` width, number type


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


### createTechnicalIndicator(name, isStack, paneOptions)
Create a technical indicator, the return value is a string that identifies the window, which is very important, and some subsequent operations on the window require this identification.
- `name` Technical indicator name
- `isStack` is covered
- `paneOptions` window configuration information, which can be defaulted, `{ id, height, dragEnabled }`
  - `id` window id, default. Special paneId: candle_pane, the window id of the main image
  - `height` The height of the window
  - `dragEnbaled` window can be adjusted by dragging

Example:
```javascript
chart.createTechnicalIndicator('MA', false, {
  id:'pane_1',
  height: 100,
  dragEnabled: true
})
```


### overrideTechnicalIndicator(override)
Cover technical indicator information.
- `override` some parameters that need to be overridden, `{ name, calcParams, calcParamsAllowDecimal, precision, styles }`
  - `name` technical indicator name, required field
  - `calcParams` calculation parameters, default
  - `calcParamsAllowDecimal` calculation parameters allow decimals
  - `precision` precision, default
  - `styles` style, which can be defaulted, and the `technicalIndicator` in the same style configuration is consistent

Example:
```javascript
chart.overrideTechnicalIndicator({
  name:'BOLL',
  calcParams: [20, 5.5],
  calcParamsAllowDecimal: { 1: true },
  precision: 4,
  styles: {
    bar: {
      upColor:'#26A69A',
      downColor:'#EF5350',
      noChangeColor:'#888888'
    },
    line: {
      size: 1,
      colors: ['#FF9600','#9D65C9','#2196F3','#E11D74','#01C5C4']
    },
    circle: {
      upColor:'#26A69A',
      downColor:'#EF5350',
      noChangeColor:'#888888'
    }
  }
})
```


### getTechnicalIndicatorByName(name)
Obtain technical indicator information according to the technical indicator name.
- `name` technical indicator name, can be the default, the default returns all


### getTechnicalIndicatorByPaneId(paneId)
Obtain technical indicator information according to the window id.
- `paneId` window id, which can be defaulted, and all are returned by default.

Special paneId: candle_pane, the window id of the main image


### removeTechnicalIndicator(paneId, name)
Remove technical indicators.
- `paneId` window id, which is the window ID returned when the createTechnicalIndicator method is called
Special paneId: candle_pane, the window id of the main image
- `name` technical indicator type, if default, all will be removed


### addCustomTechnicalIndicator(technicalIndicator)
Add a custom technical indicator. Can be created in batches, just pass in the array in batches.
- `technicalIndicator` technical indicator information, please refer to [Technical Indicators](technical-indicator.md)


### createGraphicMark(name, options)
Create a graphic mark and return a string type identifier
- `name` Graphic mark type
- `options` configuration, `{ id, points, styles, lock, onDrawStart, onDrawing, onDrawEnd, onClick, onRightClick, onPressedMove, onRemove }`
  - `id` can be defaulted, if specified, the id will be returned
  - `points` point information, can be defaulted, if specified, a graph will be drawn according to the point information
  - `styles` style, can be defaulted, the format is the same as `graphicMark` in the configuration
  - `lock` is lock
  - `onDrawStart` draw start callback event, can be default
  - `onDrawing` callback event during drawing, can be default
  - `onDrawEnd` draw end callback event, can be default
  - `onClick` click callback event, default
  - `onRightClick` right-click callback event, it can be defaulted, it needs to return a boolean type value, if it returns true, the built-in right-click delete will be invalid
  - `onMouseEnter` mouse enter event, default
  - `onMouseLeave` mouse leave event, default
  - `onPressedMove` press and drag callback event
  - `onRemove` delete callback event

Example:
```javascript
chart.createGraphicMark(
  'segment',
  {
    points: [
      {timestamp: 1614171282000, price: 18987 },
      {timestamp: 1614171202000, price: 16098 },
    ],
    styles: {
      line: {
        color:'#f00',
        size: 2
      }
    },
    lock: true,
    onDrawStart: function ({ id }) {console.log(id) },
    onDrawing: function ({ id, step, points }) {console.log(id, step, points) },
    onDrawEnd: function ({ id }) {console.log(id) },
    onClick: function ({ id, event }) {console.log(id, event) },
    onRightClick: function ({ id, event }) {
      console.log(id, event)
      return false
    },
    onMouseEnter: function ({ id, event }) { console.log(id, event) },
    onMouseLeave: function ({ id, event }) { console.log(id, event) },
    onPressedMove: function ({ id, event }) {console.log(id, event) },
    onRemove: function ({ id }) {console.log(id)}
  }
)
```


### getGraphicMark(id)
Get graphic mark information.
- `id` calls the createGraphicMark method to return the identity


### setGraphicMarkOptions(id, options)
Set the drawn graphic mark configuration.
- `id` calls the createGraphicMark method to return the identity
- `options` configuration, `{ styles, lock }`
  - `styles` style, the format is the same in the configuration of `graphicMark`
  - `lock` is lock


### addCustomGraphicMark(graphicMark)
Add custom graphic markers. Can be created in batches, just pass in the array in batches.
- `graphicMark` graphic mark information, please refer to [details](graphic-mark.md)


### removeGraphicMark(id)
Remove all graphic marks.
- `id` call the createGraphicMark method is the returned mark, if the default is, all marks will be removed


### createAnnotation(annotation)
Create annotation. Can be created in batches, just pass in the array in batches.
- `annotation` annotation information, `{ point, styles, checkPointInCustomSymbol, drawCustomSymbol, drawExtend, onClick, onRightClick onMouseEnter, onMouseLeave }`
  - `point` point `{ timestamp, price }`
  - `styles` style, the format is the same in the configuration of `annotation`
  - `checkPointInCustomSymbol` Triggered when the style `annotation.symbol.type` is `custom`
  - `drawCustomSymbol` Triggered when the style `annotation.symbol.type` is `custom`
  - `drawExtend` Extend drawing method
  - `onClick` click callback event, default
  - `onRightClick` right-click callback event, default
  - `onMouseEnter` mouse enter event, default
  - `onMouseLeave` mouse leave event, default
Example:
```javascript
chart.createAnnotation({
  point: { timestamp: 1614171282000, price: 18987 },
  styles: {
    symbol: {
      type: 'diamond',
      position: 'top',
      size: 8,
      color: '#2196F3',
      activeSize: 10,
      activeColor: '#FF9600',
      offset: [0, 20]
    }
  },
  checkPointInCustomSymbol: function ({ point, coordinate, size }) {
    console.log(point, coordinate, size)
    return true
  },
  drawCustomSymbol: function ({ ctx, point, coordinate, viewport, isActive, styles }) {
    console.log(point, coordinate, viewport, isActive, styles)
  },
  drawExtend: function ({ ctx, point, coordinate, viewport, isActive, styles }) {
    console.log(point, coordinate, viewport, isActive, styles)
  },
  onClick: function ({ id, event }) { console.log(id, event) },
  onRightClick: function ({ id, event }) { console.log(id, event) },
  onMouseEnter: function ({ id, event }) { console.log(id, event) },
  onMouseLeave: function ({ id, event }) { console.log(id, event) },
})
```


### removeAnnotation(points)
Remove annotation. Can be removed in batches, just pass in the array in batches, if default, remove all.
- `points` single point or collection, `{ timestamp }`


### createTag(tag)
Create tags, you can create them in batches, just pass in an array in batches.
- `tag` tag，`{ id, point, text, mark, styles }`
  - `id` unique identifier, if there are duplicates, it will be overwritten
  - `point` point, default
  - `text` text, default
  - `mark` mark, default
  - `styles` style, default, the format is the same as the `tag` in the configuration
Example:
```javascript
chart.createTag({
  id: 'bid_price',
  point: { price: 16908 },
  text: '16908.00',
  mark: 'bid',
  styles: {
    position: 'point',
    offset: 0,
    line: {
      show: true,
      style: LineStyle.DASH,
      dashValue: [4, 2],
      size: 1,
      color: '#2196F3'
    },
    text: {
      color: '#FFFFFF',
      backgroundColor: '#2196F3',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: 2
    },
    mark: {
      color: '#FFFFFF',
      backgroundColor: '#2196F3',
      size: 12,
      family: 'Helvetica Neue',
      weight: 'normal',
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: 2
    }
  }
})
```

### removeTag(id)
Remove tags, you can remove them in batches, just pass in the array in batches, if default, remove all.
- `id` Unique identification of the tag



### scrollByDistance(distance, animationDuration)
Roll a certain distance.
-`distance` distance
-`animationDuration` animation time, can be default


### scrollToRealTime(animationDuration)
Scroll to the original position.
-`animationDuration` animation time, can be default


### scrollToPosition(position, animationDuration)
Scroll to the specified position.
-`position` position, which is the index of the data
-`animationDuration` animation time, can be default


### zoomAtCoordinate(scale, coordinate, animationDuration)
Zoom at coordinate.
-`scale` scaling ratio
-`coordinate` coordinate point, `{ x }` can be defaulted, the default is to zoom in the middle of the chart
-`animationDuration` animation time, can be defaulted, the default is no animation


### zoomAtPosition(scale, position, animationDuration)
Zoom at position.
-`scale` scaling ratio
-`position` position, which is the index of the data
-`animationDuration` animation time, can be defaulted, the default is no animation


### setPaneOptions(options)
Set pane options.
- `options` pane options `{ id, height, dragEnabled }`
  - `id` pane id
  - `height` The height of the window
  - `dragEnbaled` window can be adjusted by dragging
Example:
```javascript
chart.setPaneOptions({
  id: 'pane_1',
  height: 100,
  dragEnabled: true
})
```


### subscribeAction(type, callback)
Subscribe to chart actions.
- `type` The type is 'drawCandle', 'drawTechnicalIndicator', 'zoom', 'scroll' and 'crosshair'
- `callback` is a callback method


### unsubscribeAction(type, callback)
Unsubscribe from chart actions.
- `type` type is 'drawCandle', 'drawTechnicalIndicator', 'zoom', 'scroll' and 'crosshair'
- `callback` callback method when subscribing


### convertToPixel(value, finder)
Convert value to coordinate value.
- `value` value, `{ xAxisValue, yAxisValue }`
- `finder` finder value, `{ paneId, dataIndexXAxis, absoluteYAxis }`


### convertFromPixel(coordinate, finder)
Convert coordinate value to value.
- `coordinate` coordinate, `{ x, y }`
- `finder` finder value, `{ paneId, dataIndexXAxis, absoluteYAxis }`


### getConvertPictureUrl(includeTooltip, includeGraphicMark, type, backgroundColor)
Get the picture url after the chart is converted into a picture.
- `includeTooltip` Whether to include tooltip, it can be defaulted
- `includeGraphicMark` Whether to include graphic mark, it can be defaulted
- `type` The converted picture type. The type is one of three types: 'png', 'jpeg', and 'bmp', which can be defaulted, and the default is 'jpeg'
- `backgroundColor` background color, can be the default, the default is '#FFFFFF'


### resize()
Resizing the chart will always fill the container size.
Note: This method will recalculate the size of each module of the entire chart. Frequent calls may affect performance. Please be cautious when calling
