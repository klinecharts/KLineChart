# 覆盖物
本文档介绍了图表内置的覆盖物和如何自定义一个覆盖物。

## 内置覆盖物类型
`horizontalRayLine`, `horizontalSegment`, `horizontalStraightLine`, `verticalRayLine`, `verticalSegment`, `verticalStraightLine`, `rayLine`, `segment`, `straightLine`, `priceLine`, `priceChannelLine`, `parallelStraightLine`, `fibonacciLine`, `simpleAnnotation`, `simpleTag`

## 自定义覆盖物
自定义一个覆盖物，然后通过`klinecharts.registerOverlay` 全局添加，添加到图表即可和内置覆盖物一样去使用。
### 属性说明
```typescript
{
  // 名称，必须字段，作为覆盖物创建的唯一标识
  name: string

  // 总共需要多少步操作才行绘制完成，非必须
  totalStep?: number

  // 是否锁定，不触发事件，非必须
  lock?: boolean

  // 是否可见
  visible?: boolean

  // 绘制层级，值越大越靠前显示
  zLevel?: number

  // 是否需要默认的点对应的图形，非必须
  needDefaultPointFigure?: boolean

  // 是否需要默认的X轴上的图形，非必须
  needDefaultXAxisFigure?: boolean

  // 是否需要默认的Y轴上的图形，非必须
  needDefaultYAxisFigure?: boolean

  // 模式，可选项为`normal`，`weak_magnet`，`strong_magnet`，非必须
  mode?: 'normal' | 'weak_magnet' | 'strong_magnet'

  // 模式灵敏度，仅 mode 是 weak_magnet 时有效
  modeSensitivity?: number

  // 点信息，非必须
  points?: Array<{
    // 时间戳
    timestamp: number
    // 数据索引
    dataIndex?: number
    // 对应y轴的值
    value?: number
  }>

  // 扩展数据，非必须
  extendData?: any

  // 样式，非必须，类型参与[样式]中的overlay
  styles?: OverlayStyle

  // 创建点对应的图形，非必须
  createPointFigures: ({
    // 覆盖物实例
    overlay: Overlay
    // points对应的坐标信息
    coordinates: Array<{
      x: number
      y: number
    }>
    // 窗口尺寸信息
    bounding: {
      // 宽
      width: number
      // 高
      height: number
      // 距离左边距离
      left: number
      // 距离右边距离
      right: number
      // 距离顶部距离
      top: number
      // 距离底部距离
      bottom: number
    }
    // 蜡烛柱的尺寸信息
    barSpace: {
      // 蜡烛柱尺寸
      bar: number
      halfBar: number
      // 蜡烛柱不包含蜡烛柱之间间隙的尺寸
      gapBar: number
      halfGapBar: number
    }
    // 精度
    precision: {
      // 价格精度
      price: number
      // 数量精度
      volume: number
    }
    // 千分符
    thousandsSeparator: string
    // 小数折叠阈值
    decimalFoldThreshold: number
    // 格式化日期和时间的对象的构造器，详情参阅 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
    dateTimeFormat: Intl.DateTimeFormat
    // 默认样式，即全局样式配置中的overlay，类型参与[样式]中的overlay
    defaultStyles: OverlayStyle
     // x轴组件，内置一些转换方法
    xAxis: XAxis
    // y轴组件，内置一些转换方法
    yAxis: YAxis
  }) => ({
    // 无特殊含义，可用于扩展字段
    key?: string
    // 图形类型，类型为klinecharts.getSupportFigures返回值中的一种
    type: string
    // type对应的图形的属性
    attrs: any | any[]
    // type对应的图形的样式
    styles?: any
    // 是否忽略事件
    ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
  }) | Array<{
    key?: string
    type: string
    attrs: any | any[]
    styles?: any
    ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
  }>

  // 创建X轴上的图形，非必须，参数和返回值和`createPointFigures`一致
  createXAxisFigures?: OverlayCreateFiguresCallback

  // 创建Y轴上的图形，非必须，参数和返回值和`createPointFigures`一致
  createYAxisFigures?: OverlayCreateFiguresCallback

  // 处理在绘制过程中移动操作，可缺省，移动绘制过程中触发
  performEventMoveForDrawing?: ({
    // 当前步骤
    currentStep: number
    // 模式
    mode: 'normal' | 'weak_magnet' | 'strong_magnet'
    // 点信息
    points: Array<{
      // 时间戳
      timestamp: number
      // 数据索引
      dataIndex?: number
      // 对应y轴的值
      value?: number
    }>
    // 事件所在点的索引
    performPointIndex: number
    // 事件所在点的信息
    performPoint: {
      // 时间戳
      timestamp: number
      // 数据索引
      dataIndex?: number
      // 对应y轴的值
      value?: number
    }
  }) => void

  // 处理按住移动操作，可缺省，按住某个操作点移动过程中触发
  // 回调参数和`performEventMoveForDrawing`一致
  performEventPressedMove?: (params: OverlayPerformEventParams) => void

  // 绘制开始回调事件，可缺省
  onDrawStart?: (event: OverlayEvent) => boolean

  // 绘制过程中回调事件，可缺省
  onDrawing?: (event: OverlayEvent) => boolean

  // 绘制结束回调事件，可缺省
  onDrawEnd?: (event: OverlayEvent) => boolean

  // 点击回调事件，可缺省
  onClick?: (event: OverlayEvent) => boolean

  // 双击回调事件，可缺省
  onDoubleClick?: (event: OverlayEvent) => boolean

  // 右击回调事件，可缺省，需要返回一个boolean类型的值，如果返回true，内置的右击删除将无效
  onRightClick?: (event: OverlayEvent) => boolean

  // 按住拖动开始回调事件，可缺省
  onPressedMoveStart?: (event: OverlayEvent) => boolean

  // 按住拖动回调事件，可缺省  
  onPressedMoving?: (event: OverlayEvent) => boolean

  // 按住拖动结束回调事件，可缺省
  onPressedMoveEnd?: (event: OverlayEvent) => boolean

  // 鼠标移入事件，可缺省
  onMouseEnter?: (event: OverlayEvent) => boolean

  // 鼠标移出事件，可缺省
  onMouseLeave?: (event: OverlayEvent) => boolean

  // 删除回调事件，可缺省
  onRemoved?: (event: OverlayEvent) => boolean

  // 选中回调事件，可缺省
  onSelected?: (event: OverlayEvent) => boolean

  // 取消回调事件，可缺省
  onDeselected?: (event: OverlayEvent) => boolean
}
```

### 示例
以一个填充带边框的圆来具体说明如何配置。
```javascript
{
  // 名称
  name: 'sampleCircle',

  // 完成一个圆的绘制需要三个步骤
  totalStep: 3,

  // 创建点对应的图形信息
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x)
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y)
      // 确定对应点生成的圆的坐标
      const radius = Math.sqrt(xDis * xDis + yDis * yDis)
      // 图表内置了基础图形'circle'，可以直接使用
      return {
        key: 'sampleCircle',
        type: 'circle',
        attrs: {
          ...coordinates[0],
          r: radius
        },
        styles: {
          // 选择边框且填充，其它选择使用默认样式
          style: 'stroke_fill'
        }
      }
    }
    return []
  }
}
```
这样一个自定义覆盖物就完成了。
