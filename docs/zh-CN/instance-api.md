# 实例API

### getDom(paneId, position)
获取dom容器
- `paneId` 窗口id，缺省则是整个图表容器
- `position` 位置，支持`root`，`main`，`yAxis`，缺省则是`root`


### getSize(paneId, position)
获取尺寸。
- `paneId` 窗口id，缺省则是整个图表容器
- `position` 位置，支持`root`，`main`，`yAxis`，缺省则是`root`


### setStyles(styles)
设置样式配置。
- `styles` 样式配置，详情可参阅[样式说明](styles.md)


### getStyles()
获取样式配置。


### setPriceVolumePrecision(pricePrecision, volumePrecision)
设置价格和数量精度，同时技术指标系列是'price'或者'volume'也会受影响
- `pricePrecision` 价格精度
- `volumePrecision` 数量精度


### setTimezone(timezone)
设置时区。
- `timezone` 时区名，如'Asia/Shanghai'，如果不设置会自动获取本机时区，时区对应名字列表请自寻查找相关文档


### getTimezone()
获取图表时区。


### setZoomEnabled(enabled)
设置是否缩放。
- `enabled` `true` 或 `false`


### isZoomEnabled()
是否可以缩放。


### setScrollEnabled(enabled)
设置是否可以拖拽滚动。
- `enabled` `true` 或 `false`


### isScrollEnabled()
是否可以拖拽滚动。


### setOffsetRightDistance(distance)
设置图表右边可以空出来的间隙。
- `distance` 距离


### setLeftMinVisibleBarCount(barCount)
设置左边最小可见的蜡烛数量。
- `barCount` 数量，number类型


### setRightMinVisibleBarCount(barCount)
设置右边最小可见的蜡烛数量。
- `barCount` 数量，number类型


### setBarSpace(space)
设置图表一条数据所占用的空间，即单根蜡烛柱的宽度。
- `space` 宽度，number类型


### getBarSpace()
获取图表一条数据所占用的空间。


### applyNewData(dataList, more)
添加新数据，此方法会清空图表数据，不需要额外调用clearData方法。
- `dataList` 是一个KLineData数组，KLineData类型详情可参阅数据源
- `more` 告诉图表还有没有更多历史数据，可缺省，默认为true


### applyMoreData(dataList, more)
添加历史更多数据。
- `dataList` 是一个KLineData数组，KLineData类型详情可参阅数据源
- `more` 告诉图表还有没有更多历史数据，可缺省，默认为true


### updateData(data)
更新数据，目前只会匹配当前最后一条数据的时间戳，相同则覆盖，不同则追加。
- `data` 单条k线数据


### getDataList()
获取图表目前的数据源。


### clearData()
清空图表数据，一般情况下清空数据是为了添加新的数据，为了避免重复绘制，所有这里只是清除数据，图表不会重绘


### loadMore(cb)
设置加载更多回调函数。
- `cb` 是一个回调方法，回调参数为第一条数据的时间戳


### createIndicator(value, isStack, paneOptions)
创建一个技术指标，返回值是一个标识窗口的字符串，这非常重要，后续对该窗口的一些操作，都需要此标识。
- `value` 技术指标名或者技术指标对象，当是对象时，类型和`overrideIndicator`的入参一致
- `isStack` 是否覆盖
- `paneOptions` 窗口配置信息，可缺省， `{ id, minHeight, height, dragEnabled, gap }`
   - `id` 窗口id，可缺省。特殊的paneId: candle_pane，主图的窗口id
   - `height` 窗口高度，可缺省
   - `minHeight` 窗口最小高度，可缺省
   - `dragEnbaled` 窗口是否可以拖拽调整高度，可缺省
   - `gap` 边距`{ top, bottom }`，可缺省

示例：
```javascript
chart.createTechnicalIndicator('MA', false, {
  id: 'pane_1',
  height: 100,
  minHeight: 30,
  dragEnabled: true,
  gap: { top: 0.2, bottom: 0.1 }
})
```


### overrideIndicator(override, paneId)
覆盖技术指标信息。
- `override` 需要覆盖的一些参数， `{ name, shortName, calcParams, precision, shouldOhlc, shouldFormatBigNumber, extendData, series, figures, minValue, maxValue, styles, calc, regenerateFigures, createToolTipDataSource, draw }`
  - `name` 技术指标名，必填字段
  - `shortName` 指标简短名称，可缺省
  - `calcParams` 计算参数，可缺省
  - `precision` 精度，可缺省
  - `shouldOhlc` 是否需要ohlc辅助线，可缺省
  - `shouldFormatBigNumber` 是否需要格式化大数字，可缺省
  - `extendData` 扩展数据，可缺省
  - `series` 系列，可缺省
  - `figures` 配置信息，可缺省
  - `minValue` 指定的最小值，可缺省
  - `maxValue` 指定的最大值，可缺省
  - `styles` 样式，可缺省，格式同样式配置中 `indicator` 一致
  - `calc` 计算，可缺省
  - `regenerateFigures` 重新生成数图形配置，可缺省
  - `createToolTipDataSource` 创建自定义提示文字，可缺省
  - `draw` 自定义绘制，可缺省
- `paneId` 窗口id，缺省则设置所有

示例：
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
根据窗口id获取技术指标信息。
- `paneId` 窗口id，可缺省，缺省则返回所有。
- `name` 技术指标名
特殊的paneId: candle_pane，主图的窗口id


### removeIndicator(paneId, name)
移除技术指标。
- `paneId` 窗口id，即调用createTechnicalIndicator方法时返回的窗口标识
特殊的paneId: candle_pane，主图的窗口id
- `name` 技术指标类型，如果缺省，则会移除所有


### createOverlay(value, paneId)
创建覆盖物，返回一个字符串类型的标识。
- `value` 覆盖物名或者对象，当是对象时，参数和`overrideOverlay`一致

示例：
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
根据id获取覆盖物信息。
- `id` 调用`createOverlay`方法是返回的标识


### overrideOverlay(override)
设置已绘制的覆盖物配置。
- `override` 配置， `{ name, id, points, styles, lock, mode, extendData, needDefaultPointFigure, needDefaultXAxisFigure, needDefaultYAxisFigure, onDrawStart, onDrawing, onDrawEnd, onClick, onRightClick, onPressedMoveStart, onPressedMoving, onPressedMoveEnd, onMouseEnter, onMouseLeave, onRemoved, onSelected, onDeselected }` 
  - `name` 覆盖物名
  - `id` 可缺省
  - `lock` 是否锁定
  - `needDefaultPointFigure` 是否需要默认点上的图形
  - `needDefaultXAxisFigure` 是否需要默认X轴上的图形
  - `needDefaultYAxisFigure` 是否需要默认Y轴上的图形
  - `mode` 模式类型，支持`normal`，`weak_magnet`，`strong_magnet`
  - `points` 点信息，可缺省，如果指定，则会按照点信息绘制一个图形
  - `extendData` 扩展数据，可缺省
  - `styles` 样式，可缺省，格式同样式配置中 `overlay` 一致
  - `onDrawStart` 绘制开始回调事件，可缺省
  - `onDrawing` 绘制过程中回调事件，可缺省
  - `onDrawEnd` 绘制结束回调事件，可缺省
  - `onClick` 点击回调事件，可缺省
  - `onRightClick` 右击回调事件，可缺省，需要返回一个boolean类型的值，如果返回true，内置的右击删除将无效
  - `onPressedMoveStart` 按住拖动开始回调事件，可缺省
  - `onPressedMoving` 按住拖动回调事件，可缺省
  - `onPressedMoveEnd` 按住拖动结束回调事件，可缺省
  - `onMouseEnter` 鼠标移入事件，可缺省
  - `onMouseLeave` 鼠标移出事件，可缺省
  - `onRemoved` 删除回调事件，可缺省
  - `onSelected` 选中回调事件，可缺省
  - `onDeselected` 取消回调事件，可缺省
示例：
```javascript
chart.overrideOverlay({
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
移除图形。
- `id` 调用`createOverlay`方法是返回的标识，如果缺省，则会移除所有

删除一个html元素
- `paneId` 窗口id，缺省则删除所有
- `htmlId` 创建时候的id，可以是单个id，也可以是id组成的数组，缺省则删除对应窗口上所有的


### scrollByDistance(distance, animationDuration)
滚动一定的距离。
- `distance` 距离
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### scrollToRealTime(animationDuration)
滚动到最初的位置。
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### scrollToDataIndex(dataIndex, animationDuration)
滚动到指定的位置。
- `dataIndex` 数据的索引
- `animationDuration` 动画时间，可以缺省，缺省则无动画

### scrollToTimestamp(timestamp, animationDuration)
滚动到指定时间戳。
- `timestamp` 时间戳
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### zoomAtCoordinate(scale, coordinate, animationDuration)
在某个坐标点缩放。
- `scale` 缩放比例
- `coordinate` 坐标点，`{ x }` 可缺省，缺省则在图表中间位置缩放
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### zoomAtDataIndex(scale, dataIndex, animationDuration)
在某个位置缩放。
- `scale` 缩放比例
- `dataIndex` 数据的索引
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### zoomAtTimestamp(scale, timestamp, animationDuration)
在指定时间戳上缩放。
- `scale` 缩放比例
- `timestamp` 时间戳
- `animationDuration` 动画时间，可以缺省，缺省则无动画


### setPaneOptions(options)
设置窗口配置。
- `paneOptions` 窗口配置信息，可缺省， `{ id, minHeight, height, dragEnabled, gap }`
   - `id` 窗口id，可缺省。特殊的paneId: candle_pane，主图的窗口id
   - `height` 窗口高度，可缺省
   - `minHeight` 窗口最小高度，可缺省
   - `dragEnbaled` 窗口是否可以拖拽调整高度，可缺省
   - `gap` 边距`{ top, bottom }`，可缺省

示例：
```javascript
chart.setPaneOptions({
  id: 'pane_1',
  height: 100,
  minHeight: 3,
  dragEnabled: true,
  gap: { top: 0.2, bottom: 0.1 }
})
```


### subscribeAction(type, callback)
订阅图表动作。
- `type` 类型是`onZoom`, `onScroll`, `onCrosshairChange` 和 `onPaneDrag`
- `callback` 是一个回调方法


### unsubscribeAction(type, callback)
取消订阅图表动作。
- `type` 类型是`onZoom`, `onScroll`, `onCrosshairChange` 和 `onPaneDrag`
- `callback` 订阅时的回调方法，缺省则取消当前类型所有


### convertToPixel(value, finder)
将值转换成坐标。
- `value` 值，`{ timestamp, dataIndex, value }`
- `finder` 过滤条件，`{ paneId, absolute }`


### convertFromPixel(coordinate, finder)
将坐标转换成值。
- `coordinate` 坐标，`{ x, y }`
- `finder` 过滤条件，`{ paneId, absolute }`


### getConvertPictureUrl(includeOverlay, type, backgroundColor)
获取图表转换成图片后的图片url。
- `includeOverlay` 是否需要包含浮层，可缺省
- `type` 转换后的图片类型，类型是'png'、'jpeg'、'bmp'三种中的一种，可缺省，默认为'jpeg'
- `backgroundColor` 背景色，可缺省，默认为'#FFFFFF'


### resize()
调整图表大小，总是会填充容器大小。
注意：此方法会重新计算整个图表各个模块的大小，频繁调用可能会影响到性能，调用请谨慎
