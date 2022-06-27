# Instance API

### getDom(finder)
Get container dom.
- `finder` returns the root container by default, `{ paneId, position }`
  - `pandId` pane id
  - `position` optional parameters 'root', 'content' and 'yAxis'


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


### getDataSpace()
Get the space occupied by a single piece of data on a chart.


### getBarSpace()
Get the space taken up by drawing a piece of data on a chart.


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


### createTechnicalIndicator(value, isStack, paneOptions)
Create a technical indicator, the return value is a string that identifies the window, which is very important, and some subsequent operations on the window require this identification.
- `value` name or object, when it is an object, the type is the same as the input parameter of `overrideTechnicalIndicator`
- `isStack` is covered
- `paneOptions` window configuration information, which can be defaulted, `{ id, height, dragEnabled }`
  - `id` window id, default. Special paneId: candle_pane, the window id of the main image
  - `height` The height of the window
  - `minHeight` The min height of the window
  - `dragEnbaled` window can be adjusted by dragging

Example:
```javascript
chart.createTechnicalIndicator('MA', false, {
  id:'pane_1',
  height: 100,
  minHeihgt: 50
  dragEnabled: true
})
```


### overrideTechnicalIndicator(override, paneId)
Cover technical indicator information.
- `override` some parameters that need to be overridden, `{ name, calcParams, calcParamsAllowDecimal, precision, styles }`
  - `name` technical indicator name, required field
  - `calcParams` calculation parameters, it can be defaulted
  - `shouldOhlc` Whether ohlc auxiliary line is needed, it can be defaulted
  - `shouldFormatBigNimber` Whether you need to format large numbers, it can be defaulted
  - `precision` precision, default
  - `styles` style, it can be defaulted, and the `technicalIndicator` in the same style configuration is consistent
- `paneId` pane id, all are set by default

Example:
```javascript
chart.overrideTechnicalIndicator({
  name:'BOLL',
  calcParams: [20, { value: 5.5, allowDecimal: true }],
  precision: 4,
  shouldOhlc: true,
  shouldFormatBigNimber: false,
  styles: {
    margin: {
      top: 0.2,
      bottom: 0.1
    },
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
}, 'candle_pane')
```


### getTechnicalIndicatorTemplate(name)
Obtain technical indicator information according to the technical indicator name.
- `name` technical indicator name, can be the default, the default returns all


### getTechnicalIndicatorByPaneId(paneId, name)
Obtain technical indicator information according to the window id.
- `paneId` window id, which can be defaulted, and all are returned by default.
- `name` technical indicator name

Special paneId: candle_pane, the window id of the main image


### removeTechnicalIndicator(paneId, name)
Remove technical indicators.
- `paneId` pane id, which is the pane id returned when the createTechnicalIndicator method is called
Special paneId: candle_pane, the window id of the main image
- `name` technical indicator type, if default, all will be removed


### addTechnicalIndicatorTemplate(template)
Add a technical indicator template. Can be created in batches, just pass in the array in batches.
- `template` technical indicator template, please refer to [Technical Indicators](technical-indicator.md)


### createShape(value, paneId)
Create a shape and return a string type identifier
- `value` name or object, when is object, `{ name, id, points, styles, lock, data, onDrawStart, onDrawing, onDrawEnd, onClick, onRightClick, onPressedMove, onRemove }`
  - `name` shape name
  - `id` can be defaulted, if specified, the id will be returned
  - `points` point information, can be defaulted, if specified, a graph will be drawn according to the point information
  - `styles` style, can be defaulted, the format is the same as `shape` in the configuration
  - `lock` is lock
  - `mode` mode type, 'normal' | 'weak_magnet' | 'strong_magnet'
  - `data` data
  - `onDrawStart` draw start callback event, can be default
  - `onDrawing` callback event during drawing, can be default
  - `onDrawEnd` draw end callback event, can be default
  - `onClick` click callback event, default
  - `onRightClick` right-click callback event, it can be defaulted, it needs to return a boolean type value, if it returns true, the built-in right-click delete will be invalid
  - `onMouseEnter` mouse enter event, default
  - `onMouseLeave` mouse leave event, default
  - `onPressedMove` press and drag callback event
  - `onRemove` delete callback event
- `paneId` pane id

Example:
```javascript
chart.createShape({
  name: 'segment',
  points: [
    {timestamp: 1614171282000, value: 18987 },
    {timestamp: 1614171202000, value: 16098 },
  ],
  styles: {
    line: {
      color:'#f00',
      size: 2
    }
  },
  lock: true,
  mode: 'weak_magnet',
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
}, 'candle_pane')
```


### getShape(shapeId)
Get shape information.
- `paneId` pane id
- `shapeId` calls the createShape method to return the identity, by default it returns all


### setShapeOptions(options)
Set the drawn shape configuration.
- `options` configuration, `{ id, points, styles, lock, mode, data }`
  - `id` calls the createShape method to return the identity, by default it set all
  - `points` point
  - `styles` style, the format is the same in the configuration of `shape`
  - `lock` is lock
  - `mode` mode type, 'normal' | 'weak_magnet' | 'strong_magnet'
  - `data` data


### addShapeTemplate(template)
Add a shape template. Can be created in batches, just pass in the array in batches.
- `template` shape information, please refer to [details](shape.md)


### removeShape(shapeId)
Remove shape.
- `shapeId` call the createShape method is the returned mark, if the default is, all marks will be removed


### createAnnotation(annotation, paneId)
Create annotation. Can be created in batches, just pass in the array in batches.
- `annotation` annotation information, `{ point, styles, checkEventCoordinateOnCustomSymbol, drawCustomSymbol, drawExtend, onClick, onRightClick onMouseEnter, onMouseLeave }`
  - `point` point `{ timestamp, value }`
  - `styles` style, the format is the same in the configuration of `annotation`
  - `checkEventCoordinateOnCustomSymbol` Triggered when the style `annotation.symbol.type` is `custom`
  - `drawCustomSymbol` Triggered when the style `annotation.symbol.type` is `custom`
  - `drawExtend` Extend drawing method
  - `onClick` click callback event, default
  - `onRightClick` right-click callback event, default
  - `onMouseEnter` mouse enter event, default
  - `onMouseLeave` mouse leave event, default
- `paneId` pane id
Example:
```javascript
chart.createAnnotation({
  point: { timestamp: 1614171282000, value: 18987 },
  styles: {
    offset: [0, 20]
    position: 'top',
    symbol: {
      type: 'diamond',
      size: 8,
      color: '#2196F3',
      activeSize: 10,
      activeColor: '#FF9600',
    }
  },
  checkEventCoordinateOnCustomSymbol: function ({ eventCoordinate, coordinate, size }) {
    console.log(eventCoordinate, coordinate, size)
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


### removeAnnotation(paneId, points)
Remove annotation. Can be removed in batches, just pass in the array in batches, if default, remove all.
- `paneId` pane id, Remove all by default
- `points` single point or collection, `{ timestamp }`


### createTag(tag, paneId)
Create tags, you can create them in batches, just pass in an array in batches.
- `tag` tag，`{ id, point, text, mark, styles }`
  - `id` unique identifier, if there are duplicates, it will be overwritten
  - `point` point, default
  - `text` text, default
  - `mark` mark, default
  - `styles` style, default, the format is the same as the `tag` in the configuration
- `paneId` pane id
Example:
```javascript
chart.createTag({
  id: 'bid_price',
  point: { value: 16908 },
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


### removeTag(paneId, tagId)
Remove tags, you can remove them in batches, just pass in the array in batches, if default, remove all.
- `paneId` pane id, Remove all by default
- `tagId` Unique identification of the tag


### removeTag(paneId, tagId)
To remove tags, you can remove them in batches. You can pass in an array in batches. If the default is used, all of them will be removed.
- `paneId` pane id, default removes all
- `tagId` The unique identifier of the tag, by default removes all tags on the pane


### createHtml(html, paneId)
Create an html element that returns an id.
- `html` element `{ id, position, content, style }`
  - `id` id
  - `position` position, type is `yAxis` and `content`, default is `content`
  - `style` html element container style, inline css style
  - `content` content, which can be a dom element or a string composed of dom elements
- `paneId` window id, default is 'candle_pane'
Example:
```javascript
chart.createHtml({
  id: 'html_1',
  position: 'content',
  style: { zIndex: 12 },
  content: '<div>8888888</div>'
}, 'candle_pane')
```

### removeHtml(paneId, htmlId)
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
- `options` pane options `{ id, height, dragEnabled }`
  - `id` pane id
  - `height` The height of the window
  - `minHeight` The min height of the window
  - `dragEnbaled` window can be adjusted by dragging
Example:
```javascript
chart.setPaneOptions({
  id: 'pane_1',
  height: 100,
  minHeight: 50,
  dragEnabled: true
})
```


### subscribeAction(type, callback)
Subscribe to chart actions.
- `type` The type is 'zoom', 'scroll', 'crosshair', 'tooltip' and 'pane_drag'
- `callback` is a callback method


### unsubscribeAction(type, callback)
Unsubscribe from chart actions.
- `type` type is 'zoom', 'scroll', 'crosshair', 'tooltip' and 'pane_drag'
- `callback` callback method when subscribing


### convertToPixel(value, finder)
Convert value to coordinate value.
- `value` value, `{ timestamp, dataIndex, value }`
- `finder` finder value, `{ paneId, absoluteYAxis }`


### convertFromPixel(coordinate, finder)
Convert coordinate value to value.
- `coordinate` coordinate, `{ x, y }`
- `finder` finder value, `{ timestamp, dataIndex, value }`


### getConvertPictureUrl(includeOverlay, type, backgroundColor)
Get the picture url after the chart is converted into a picture.
- `includeOverlay` Whether to include overlay, it can be defaulted
- `type` The converted picture type. The type is one of three types: 'png', 'jpeg', and 'bmp', which can be defaulted, and the default is 'jpeg'
- `backgroundColor` background color, can be the default, the default is '#FFFFFF'


### resize()
Resizing the chart will always fill the container size.
Note: This method will recalculate the size of each module of the entire chart. Frequent calls may affect performance. Please be cautious when calling
