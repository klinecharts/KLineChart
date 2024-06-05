# 实例API

## getDom(paneId, position)
```typescript
(paneId?: string, position?: 'root' | 'main' | 'yAxis') => HTMLElement
```
获取dom容器。
- `paneId` 窗口id，缺省则是整个图表容器
- `position` 支持`root`，`main`，`yAxis`，缺省则是`root`


## getSize(paneId, position)
```typescript
(paneId?: string, position?: 'root' | 'main' | 'yAxis') => {
  width: number
  height: number
  left: number
  top: number
  right: number
  bottom: number
}
```
获取尺寸。
- `paneId` 窗口id，缺省则是整个图表容器
- `position` 位置，支持`root`，`main`，`yAxis`，缺省则是`root`


## setStyles(styles)
```typescript
(styles: string | object) => HTMLElement
```
设置样式配置。
- `styles` 样式配置，可以是通过`registerStyles`注册进去的样式名。当是对象时，详情可参阅[样式](./styles.md)，支持合并。


## getStyles()
```typescript
() => object
```
获取样式配置，返回完整类型参阅[样式](./styles.md)。


## setPriceVolumePrecision(pricePrecision, volumePrecision)
```typescript
(pricePrecision: number, volumePrecision: number) => void
```
设置价格和数量精度，同时技术指标系列是'price'或者'volume'也会受影响。
- `pricePrecision` 价格精度
- `volumePrecision` 数量精度


## setTimezone(timezone)
```typescript
(timezone: string) => void
```
设置时区。
- `timezone` 时区名，如'Asia/Shanghai'，如果不设置会自动获取本机时区，时区对应名字列表请参阅[时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)。


## getTimezone()
```typescript
() => string
```
获取图表时区名。


## setZoomEnabled(enabled)
```typescript
(enabled: boolean) => void
```
设置是否缩放。


## isZoomEnabled()
```typescript
() => boolean
```
是否可以缩放。


## setScrollEnabled(enabled)
```typescript
(enabled: boolean) => void
```
设置是否可以拖拽滚动。


## isScrollEnabled()
```typescript
() => boolean
```
是否可以拖拽滚动。


## setOffsetRightDistance(distance)
```typescript
(distance: number) => void
```
设置图表右边可以空出来的间隙。


## getOffsetRightDistance() <Badge>^9.2.0</Badge>
```typescript
() => number
```
获取图表右边可以空出来的间隙。


## setMaxOffsetLeftDistance() <Badge>^9.7.0</Badge>
```typescript
(distance: number) => void
```
设置图表左边最大可空出来的间隙。


## setMaxOffsetRightDistance() <Badge>^9.7.0</Badge>
```typescript
(distance: number) => void
```
设置图表右边最大可空出来的间隙。


## setLeftMinVisibleBarCount(barCount)
```typescript
(barCount: number) => void
```
设置左边最小可见的蜡烛数量。


## setRightMinVisibleBarCount(barCount)
```typescript
(barCount: number) => void
```
设置右边最小可见的蜡烛数量。


## setBarSpace(space)
```typescript
(space: number) => void
```
设置图表单根蜡烛柱的宽度。


## getBarSpace()
```typescript
() => number
```
获取图表单根蜡烛柱的宽度。


## getVisibleRange()
```typescript
() => {
  from: number
  to: number
  realFrom: number
  realTo: number
}
```
获取可见区间范围。

## applyNewData(dataList, more, callback)
```typescript
(
  dataList：Array<{
    timestamp: number
    open: number
    close: number
    high: number
    low: number
    volume?: number,
    turnover?: number
  }>,
  more?: boolean,
  callback?: () => void
) => void
```
添加新数据，此方法会清空图表数据，不需要额外调用clearData方法。
- `dataList` 是一个K线数据数组，数据类型详情可参阅[数据源](./data-source.md)
- `more` 告诉图表还有没有更多历史数据，可缺省，默认为true
- `callback` 成功回调 <Badge>^9.2.0</Badge>
::: warning 注意
参数 `callback` 自版本9.8.0开始，已废弃，请使用 `subscribeAction('onDataReady', () => {})` 代替。
:::


## applyMoreData(dataList, more, callback)
```typescript
(
  dataList：Array<{
    timestamp: number
    open: number
    close: number
    high: number
    low: number
    volume?: number
    turnover?: number
  }>,
  more?: boolean,
  callback?: () => void
) => void
```
添加历史更多数据。
- `dataList` 是一个K线数据数组，数据类型详情可参阅[数据源](./data-source.md)
- `more` 告诉图表还有没有更多历史数据，可缺省，默认为true
- `callback` 成功回调 <Badge>^9.2.0</Badge>
::: warning 注意
该方法自版本9.8.0开始，已废弃。
:::


## updateData(data, callback)
```typescript
(
  data: {
    timestamp: number
    open: number
    close: number
    high: number
    low: number
    volume?: number
    turnover?: number
  },
  callback?: () => void
) => void
```
更新数据，目前只会匹配当前最后一条数据的时间戳，相同则覆盖，不同则追加。
- `data` 单条k线数据，数据类型详情可参阅[数据源](./data-source.md)
- `callback` 成功回调 <Badge>^9.2.0</Badge>
::: warning 注意
参数 `callback` 自版本9.8.0开始，已废弃，请使用 `subscribeAction('onDataReady', () => {})` 代替。
:::


## getDataList()
```typescript
() => Array<{
  timestamp: number
  open: number
  close: number
  high: number
  low: number
  volume?: number
  turnover?: number
}>
```
获取图表目前的数据源，返回数据类型可参阅[数据源](./data-source.md)。


## clearData()
```typescript
() => void
```
清空图表数据，一般情况下不用手动调用，为了避免重复绘制，这里只是清除数据，图表不会重绘。


## loadMore(cb)
```typescript
(cb: (timestamp: number | null) => void) => void
```
设置加载更多回调函数。
- `cb` 是一个回调方法，`timestamp`为第一条数据的时间戳
::: warning 注意
该方法自版本9.8.0开始，已废弃，请使用 `setLoadDataCallback` 代替。
:::


## setLoadDataCallback(cb) <Badge>^9.8.0</Badge>
```typescript
(
  cb: (params: { 
    type: 'forward' | 'backward'
    data: Nullable<KLineData>
    callback: (dataList: KLineData[], more?: boolean) => void
  }) => void
) => void
```
设置自动加载数据回调方法
- `cb` 回调方法
  - `params` 回调参数
    - `type` 类型，是往前加载还是往后加载
    - `data` 加载边界的数据
    - `callback` 回调方法，用于回传数据给图表

## createIndicator(value, isStack, paneOptions, callback)
```typescript
(
  value: string | {
    name: string
    shortName?: string
    precision?: number
    calcParams?: any[]
    shouldOhlc?: boolean
    shouldFormatBigNumber?: boolean
    visible?: boolean
    zLevel?: number
    extendData?: any
    series?: 'normal' | 'price' | 'volume'
    figures?: Array<{
      key: string
      title?: string
      type?: string
      baseValue?: number
      attrs?: ({
        data: object
        coordinate: object
        bounding: object
        barSpace: object
        xAxis: object
        yAxis: object
      }) => object
      styles?: (
        data: object,
        indicator: object,
        defaultStyles: object
      ) => ({
        style?: 'solid' | 'dashed' | 'stroke' | 'fill' | 'stroke_fill'
        color?: string
      })
    }>
    minValue?: number
    maxValue?: number
    styles?: object
    calc?: (dataList: KLineData[], indicator: object) => Promise<object[]> | object[]
    regenerateFigures?: (calcParms: any[]) => Array<{
      key: string
      title?: string
      type?: string
      baseValue?: number
      styles?: (
        data: object,
        indicator: object,
        defaultStyles: object
      ) => {
        style?: 'solid' | 'dashed' | 'stroke' | 'fill' | 'stroke_fill'
        color?: string
      }
    }>,
    createTooltipDataSource?: (params: object) => {
      name?: string
      calcParamsText?: string
      values?: Array<{
        title: string | {
          text: string
          color: string
        }
        value: string | {
          text: string
          color: string
        }
      }>
    }
    draw?: (params: object) => boolean
  },
  isStack?: boolean,
  paneOptions?: {
    id?: string
    height?: number
    minHeight?: number
    dragEnabled?: boolean
    position?: 'top' | 'bottom'
    gap?: {
      top?: number
      bottom?: number
    }
    axisOptions?: {
      name?: string
      scrollZoomEnabled?: boolean
    }
  } | null,
  callback?: () => void
) => string | null
```
创建一个技术指标，返回值是一个标识窗口的字符串，这非常重要，后续对该窗口的一些操作，都需要此标识。
- `value` 技术指标名或者技术指标对象，当是对象时，类型和图表方法`overrideIndicator`的入参一致
- `isStack` 是否覆盖
- `paneOptions` 窗口配置信息，可缺省
  - `id` 窗口id，可缺省
  - `height` 窗口高度，可缺省
  - `minHeight` 窗口最小高度，可缺省
  - `dragEnabled` 窗口是否可以拖拽调整高度，可缺省
  - `position` 位置，仅仅在创建新的窗口时有效 <Badge>^9.6.0</Badge>
  - `gap` 边距
    - `top` 上边距，值小余1则是百分比
    - `bottom` 下边距，值小余1则是百分比
  - `axisOptions`
    - `name` 指定的轴的名字，此参数对应图表实例方法 [registerYAxis(axis)](./chart-api#registeryaxis-axis) 中的 `axis.name`，默认为 'default' <Badge>^9.8.0</Badge>
    - `scrollZoomEnabled` 轴上是否可以滚动缩放 <Badge>^9.3.0</Badge>
  
- `callback` 指标创建完成回调方法
::: tip 特殊的id
'candle_pane'，主图的窗口id。
:::

示例：
```javascript
chart.createIndicator('MA', false, {
  id: 'pane_1',
  height: 100,
  minHeight: 30,
  dragEnabled: true,
  gap: { top: 0.2, bottom: 0.1 },
  axisOptions: { scrollZoomEnabled: true }
}, () => {})
```


## overrideIndicator(override, paneId, callback)
```typescript
(
  override: {
    name: string
    shortName?: string
    precision?: number
    calcParams?: any[]
    shouldOhlc?: boolean
    shouldFormatBigNumber?: boolean
    visible?: boolean
    zLevel?: number
    extendData?: any
    series?: 'normal' | 'price' | 'volume'
    figures?: Array<{
      key: string
      title?: string
      type?: string
      baseValue?: number
      attrs?: ({
        data: object
        coordinate: object
        bounding: object
        barSpace: object
        xAxis: object
        yAxis: object
      }) => object
      styles?: (
        data: object,
        indicator: object,
        defaultStyles: object
      ) => {
        style?: 'solid' | 'dashed' | 'stroke' | 'fill' | 'stroke_fill'
        color?: string
      }
    }>
    minValue?: number
    maxValue?: number
    styles?: object
    calc?: (dataList: KLineData[], indicator: object) => Promise<object[]> | object[]
    regenerateFigures?: (calcParms: any[]) => Array<{
      key: string
      title?: string
      type?: string
      baseValue?: number
      styles?: (
        data: object,
        indicator: object,
        defaultStyles: object
      ) => {
        style?: 'solid' | 'dashed' | 'stroke' | 'fill' | 'stroke_fill'
        color?: string
      }
    }>,
    createTooltipDataSource?: (params: object) => {
      name?: string
      calcParamsText?: string
      values?: Array<{
        title: string | {
          text: string
          color: string 
        }
        value: string | {
          text: string
          color: string
        }
      }>
    }
    draw?: (params: object) => boolean
  },
  paneId?: string | null,
  callback?: () => void
) => void
```
覆盖技术指标信息。
- `override` 需要覆盖的一些参数
  - `name` 指标名，用于创建和操作的唯一标识
  - `shortName` 简短名字，用于显示
  - `precision` 精度
  - `calcParams` 计算参数
  - `shouldOhlc` 是否需要ohlc辅助图形
  - `shouldFormatBigNumber` 是否需要格式化大的数字。如1000转换成1k，1000000转换为1M等
  - `visible` 是否可见
  - `zLevel` 层级 <Badge>^9.7.0</Badge>
  - `extendData` 扩展数据
  - `series` 指标系列，可选项有'normal'，'price'和'volume'
  - `figures` 图形配置
  - `minValue` 指定最小值
  - `maxValue` 指定最大值
  - `styles` 样式
  - `calc` 计算方法
  - `regenerateFigures` 重新生成图形信息方法
  - `createTooltipDataSource` 创建自定义提示信息方法
  - `draw` 自定义绘制方法
- `paneId` 窗口id，缺省则设置所有
- `callback` 成功回调
::: tip 特殊的id
'candle_pane'，主图的窗口id。
:::

示例：
```javascript
chart.overrideIndicator({
  name: 'BOLL',
  showName: 'BOLL'
  calcParams: [20, 5.5],
  precision: 4,
  shouldOhlc: true,
  shouldFormatBigNumber: false,
  visible: true,
  zLevel: 1,
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
}, 'candle_pane', () => {})
```


## getIndicatorByPaneId(paneId, name)
```typescript
(paneId?: string, name?: string) => object
```
根据窗口id获取技术指标信息。
- `paneId` 窗口id，即调用`createIndicator`方法时返回的窗口标识，可缺省，缺省则返回所有。
- `name` 技术指标名
::: tip 特殊的id
'candle_pane'，主图的窗口id。
:::


## removeIndicator(paneId, name)
```typescript
(paneId: string, name?: string) => object
```
移除技术指标。
- `paneId` 窗口id，即调用`createIndicator`方法时返回的窗口标识
- `name` 技术指标名，如果缺省，则会移除所有
::: tip 特殊的id
'candle_pane'，主图的窗口id。
:::


## createOverlay(value, paneId)
```typescript
(
  value: string | {
    name: string
    id?: string
    groupId?: string
    lock?: boolean
    visible?: boolean
    zLevel?: number
    needDefaultPointFigure?: boolean
    needDefaultXAxisFigure?: boolean
    needDefaultYAxisFigure?: boolean
    mode?: 'normal' | 'weak_magnet' | 'strong_magnet'
    modeSensitivity?: number
    points?: Array<{
      timestamp?: number
      dataIndex?: number
      value?: number
    }>
    extendData?: any
    styles?: object
    onDrawStart?: (event: object) => boolean
    onDrawing?: (event: object) => boolean
    onDrawEnd?: (event: object) => boolean
    onClick?: (event: object) => boolean
    onDoubleClick?: (event: object) => boolean
    onRightClick?: (event: object) => boolean
    onPressedMoveStart?: (event: object) => boolean
    onPressedMoving?: (event: object) => boolean
    onPressedMoveEnd?: (event: object) => boolean
    onMouseEnter?: (event: object) => boolean
    onMouseLeave?: (event: object) => boolean
    onRemoved?: (event: object) => boolean
    onSelected?: (event: object) => boolean
    onDeselected?: (event: object) => boolean
  } | Array<string | {
    name: string
    id?: string
    groupId?: string
    lock?: boolean
    visible?: boolean
    zLevel?: number
    needDefaultPointFigure?: boolean
    needDefaultXAxisFigure?: boolean
    needDefaultYAxisFigure?: boolean
    mode?: 'normal' | 'weak_magnet' | 'strong_magnet'
    modeSensitivity?: number
    points?: Array<{
      timestamp?: number
      dataIndex?: number
      value?: number
    }>
    extendData?: any
    styles?: object
    onDrawStart?: (event: object) => boolean
    onDrawing?: (event: object) => boolean
    onDrawEnd?: (event: object) => boolean
    onClick?: (event: object) => boolean
    onDoubleClick?: (event: object) => boolean
    onRightClick?: (event: object) => boolean
    onPressedMoveStart?: (event: object) => boolean
    onPressedMoving?: (event: object) => boolean
    onPressedMoveEnd?: (event: object) => boolean
    onMouseEnter?: (event: object) => boolean
    onMouseLeave?: (event: object) => boolean
    onRemoved?: (event: object) => boolean
    onSelected?: (event: object) => boolean
    onDeselected?: (event: object) => boolean
  }>,
  paneId?: string
) => string | null
```
创建覆盖物，返回一个字符串类型的标识。
- `value` 覆盖物名或者对象，当是对象时，参数和`overrideOverlay`一致
- `paneId` 窗口id，可缺省
::: tip 特殊的id
'candle_pane'，主图的窗口id。
:::

示例：
```javascript
chart.createOverlay({
  name: 'segment',
  id: 'segment_1',
  groupId: 'segment',
  points: [
    { timestamp: 1614171282000, value: 18987 },
    { timestamp: 1614171202000, value: 16098 },
  ],
  styles: {
    line: {
      style: 'solid',
      dashedValue: [2, 2],
      color: '#f00',
      size: 2
    }
  },
  lock: false,
  visible: true,
  zLevel: 0,
  mode: 'weak_magnet',
  modeSensitivity: 8,
  extendData: 'xxxxxxxx',
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  onDrawStart: function (event) { console.log(event) },
  onDrawing: function (event) { console.log(event) },
  onDrawEnd: function (event) { console.log(event) },
  onClick: function (event) { console.log(event) },
  onDoubleClick: function (event) { console.log(event) },
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


## getOverlayById(id)
```typescript
(id: string) => object
```
根据id获取覆盖物信息。
- `id` 调用`createOverlay`方法是返回的标识


## overrideOverlay(override)
```typescript
(
  override: {
    name: string
    id?: string
    groupId?: string
    lock?: boolean
    visible?: boolean
    zLevel?: number
    needDefaultPointFigure?: boolean
    needDefaultXAxisFigure?: boolean
    needDefaultYAxisFigure?: boolean
    mode?: 'normal' | 'weak_magnet' | 'strong_magnet'
    modeSensitivity?: number
    points?: Array<{
      timestamp?: number
      dataIndex?: number
      value?: number
    }>
    extendData?: any
    styles?: object
    onDrawStart?: (event: object) => boolean
    onDrawing?: (event: object) => boolean
    onDrawEnd?: (event: object) => boolean
    onClick?: (event: object) => boolean
    onDoubleClick?: (event: object) => boolean
    onRightClick?: (event: object) => boolean
    onPressedMoveStart?: (event: object) => boolean
    onPressedMoving?: (event: object) => boolean
    onPressedMoveEnd?: (event: object) => boolean
    onMouseEnter?: (event: object) => boolean
    onMouseLeave?: (event: object) => boolean
    onRemoved?: (event: object) => boolean
    onSelected?: (event: object) => boolean
    onDeselected?: (event: object) => boolean
  }
) => string | null
```
覆盖已绘制的覆盖物。
- `override` 需要覆盖的参数 
  - `name` 覆盖物名，用于创建的唯一标识
  - `id` 覆盖物标识，如果id存在，则会以id为依据去覆盖
  - `groupId` 编组id
  - `lock` 是否锁定不让拖动
  - `visible` 是否可见
  - `zLevel` 绘制层级，值越大越靠前显示
  - `needDefaultPointFigure` 是否需要默认的点对应的图形
  - `needDefaultXAxisFigure` 是否需要默认的x轴上的图形
  - `needDefaultYAxisFigure` 是否需要默认的y轴上的图形
  - `mode` 模式，可选项有'normal'，'weak_magnet'和'strong_magnet'
  - `modeSensitivity` 模式灵敏度，仅 mode 是 weak_magnet 时有效 <Badge>^9.5.0</Badge>
  - `points` 点信息
  - `extendData` 扩展数据
  - `styles` 样式
  - `onDrawStart` 开始绘制事件
  - `onDrawing` 绘制中事件
  - `onDrawEnd` 绘制结束事件
  - `onClick` 点击事件
  - `onDoubleClick` 双击事件 <Badge>^9.5.0</Badge>
  - `onRightClick` 右击事件
  - `onPressedMoveStart` 按住开始移动事件
  - `onPressedMoving` 按住移动中事件
  - `onPressedMoveEnd` 按住移动结束事件
  - `onMouseEnter` 鼠标移入事件
  - `onMouseLeave` 鼠标移出事件
  - `onRemoved` 删除事件
  - `onSelected` 选中事件
  - `onDeselected` 取消选中事件

示例：
```javascript
chart.overrideOverlay({
  name: 'segment',
  id: 'segment_1',
  groupId: 'segment',
  points: [
    { timestamp: 1614171282000, value: 18987 },
    { timestamp: 1614171202000, value: 16098 },
  ],
  styles: {
    line: {
      style: 'solid',
      dashedValue: [2, 2],
      color: '#f00',
      size: 2
    }
  },
  lock: false,
  visible: true,
  zLevel: 0,
  mode: 'weak_magnet',
  modeSensitivity: 8,
  extendData: 'xxxxxxxx',
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  onDrawStart: function (event) { console.log(event) },
  onDrawing: function (event) { console.log(event) },
  onDrawEnd: function (event) { console.log(event) },
  onClick: function (event) { console.log(event) },
  onDoubleClick: function (event) { console.log(event) },
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


## removeOverlay(remove)
```typescript
(
  remove: string | {
    id?: string
    groupId?: string
    name?: string
  }
) => void
```
移除图形。
- `id` 调用`createOverlay`方法是返回的标识
- `groupId` 编组id
- `name` 覆盖物名称

删除一个html元素
- `paneId` 窗口id，缺省则删除所有
- `htmlId` 创建时候的id，可以是单个id，也可以是id组成的数组，缺省则删除对应窗口上所有的


## scrollByDistance(distance, animationDuration)
```typescript
(distance: number, animationDuration?: number) => void
```
滚动一定的距离。
- `distance` 距离
- `animationDuration` 动画时间，可以缺省，缺省则无动画


## scrollToRealTime(animationDuration)
```typescript
(distance: number, animationDuration?: number) => void
```
滚动到最初的位置。
- `animationDuration` 动画时间，可以缺省，缺省则无动画


## scrollToDataIndex(dataIndex, animationDuration)
```typescript
(dataIndex: number, animationDuration?: number) => void
```
滚动到指定的位置。
- `dataIndex` 数据的索引
- `animationDuration` 动画时间，可以缺省，缺省则无动画

## scrollToTimestamp(timestamp, animationDuration)
```typescript
(timestamp: number, animationDuration?: number) => void
```
滚动到指定时间戳。
- `timestamp` 时间戳
- `animationDuration` 动画时间，可以缺省，缺省则无动画


## zoomAtCoordinate(scale, coordinate, animationDuration)
```typescript
(
  scale: number,
  coordinate?: {
    x: number
    y: number
  },
  animationDuration?: number
) => void
```
在某个坐标点缩放。
- `scale` 缩放比例
- `coordinate` 坐标点，可缺省，缺省则在图表中间位置缩放
- `animationDuration` 动画时间，可以缺省，缺省则无动画


## zoomAtDataIndex(scale, dataIndex, animationDuration)
```typescript
(scale: number, dataIndex: number, animationDuration?: number) => void
```
在某个位置缩放。
- `scale` 缩放比例
- `dataIndex` 数据的索引
- `animationDuration` 动画时间，可以缺省，缺省则无动画


## zoomAtTimestamp(scale, timestamp, animationDuration)
```typescript
(scale: number, timestamp: number, animationDuration?: number) => void
```
在指定时间戳上缩放。
- `scale` 缩放比例
- `timestamp` 时间戳
- `animationDuration` 动画时间，可以缺省，缺省则无动画


## setPaneOptions(options)
```typescript
(
  options: {
    id: string
    height?: number
    minHeight?: number
    dragEnabled?: boolean
    gap?: {
      top?: number
      bottom?: number
    }
    axisOptions?: {
      name?: string
      scrollZoomEnabled?: boolean
    }
  }
) => void
```
设置窗口配置。
- `options` 窗口配置信息，可缺省
  - `id` 窗口id
  - `height` 窗口高度，可缺省
  - `minHeight` 窗口最小高度，可缺省
  - `dragEnabled` 窗口是否可以拖拽调整高度，可缺省
  - `gap` 边距
    - `top` 上边距，值小余1则是百分比
    - `bottom` 下边距，值小余1则是百分比
  - `axisOptions`
    - `name` 轴名字 <Badge>^9.8.0</Badge>
    - `scrollZoomEnabled` 轴上是否可以滚动缩放 <Badge>^9.3.0</Badge>
::: tip 特殊的id
'candle_pane'，主图的窗口id。
:::

示例：
```javascript
chart.setPaneOptions({
  id: 'pane_1',
  height: 100,
  minHeight: 3,
  dragEnabled: true,
  gap: { top: 0.2, bottom: 0.1 },
  axisOptions: { name: 'default', scrollZoomEnabled: true }
})
```

## executeAction(type, data) <Badge>^9.2.0</Badge>
```typescript
(
   type: 'onCrosshairChange',
   data: any => void
) => void
```
执行图表动作
- `type` 仅支持 'onCrosshairChange'
- `data` 执行动作需要的数据


## subscribeAction(type, callback)
```typescript
(
  type: 'onDataReady' | 'onZoom' | 'onScroll' | 'onVisibleRangeChange' | 'onCrosshairChange' | 'onCandleBarClick' | 'onTooltipIconClick' | 'onPaneDrag',
  callback: (data?: any) => void
) => void
```
订阅图表动作。
- `type` 可选项为 'onDataReady'，'onZoom'，'onScroll'，'onVisibleRangeChange'，'onCandleBarClick', 'onTooltipIconClick'，'onCrosshairChange'和'onPaneDrag'
- `callback` 是一个回调方法


## unsubscribeAction(type, callback)
```typescript
(
  type: 'onDataReady' | 'onZoom' | 'onScroll' | 'onVisibleRangeChange' | 'onCrosshairChange' | 'onCandleBarClick' | 'onTooltipIconClick' | 'onPaneDrag',
  callback?: (data?: any) => void
) => void
```
取消订阅图表动作。
- `type` 可选项为 'onDataReady'，'onZoom'，'onScroll'，'onVisibleRangeChange'，'onCandleBarClick', 'onTooltipIconClick'，'onCrosshairChange'和'onPaneDrag'
- `callback` 订阅时的回调方法，缺省则取消当前类型所有


## convertToPixel(value, finder)
```typescript
(
  value: {
    dataIndex?: number
    timestamp?: number
    value?: number
  } | Array<{
    dataIndex?: number
    timestamp?: number
    value?: number
  }>,
  finder: {
    paneId?: string
    absolute?: boolean
  }
) => { x: number?, y?: number } | Array<{ x?: number, y?: number }>
```
将值转换成坐标。
- `value` 需要转换的值，可以是当个对象，也可以是数组
  - `dataIndex` 数据索引，如果`dataIndex`和`timestamp`同时存在，则依据索引转换
  - `timestamp` 时间戳
  - `value` 对应y轴的值
- `finder` 过滤条件
  - `paneId` 窗口id
  - `absolute` 是否是绝对坐标，只作用于y轴


## convertFromPixel(coordinate, finder)
```typescript
(
  coordinate: {
    x?: number
    y?: number
  } | Array<{
    x?: number
    y?: number
  },
  finder: {
    paneId?: string
    absolute?: boolean
  }
) => {
    dataIndex?: number
    timestamp?: number
    value?: number
  } | Array<{
    dataIndex?: number
    timestamp?: number
    value?: number
  }>
```
将坐标转换成值。
- `coordinate` 需要转换的值，可以是当个对象，也可以是数组
- `finder` 过滤条件
  - `paneId` 窗口id
  - `absolute` 是否是绝对坐标，只作用于y轴


## getConvertPictureUrl(includeOverlay, type, backgroundColor)
```typescript
(includeOverlay?: boolean, type?: string, backgroundColor?: string) => string
```
获取图表转换成图片后的图片url。
- `includeOverlay` 是否需要包含浮层，可缺省
- `type` 转换后的图片类型，类型是'png'、'jpeg'、'bmp'三种中的一种，可缺省，默认为'jpeg'
- `backgroundColor` 背景色，可缺省，默认为'#FFFFFF'


## resize()
```typescript
() => void
```
调整图表大小，总是会填充容器大小。
::: warning 注意
此方法会重新计算整个图表各个模块的大小，频繁调用可能会影响到性能，调用请谨慎。
:::

