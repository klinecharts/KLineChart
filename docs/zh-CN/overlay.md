# 覆盖物

## 默认覆盖物类型
`horizontalRayLine`, `horizontalSegment`, `horizontalStraightLine`, `verticalRayLine`, `verticalSegment`, `verticalStraightLine`, `rayLine`, `segment`, `straightLine`, `priceLine`, `priceChannelLine`, `parallelStraightLine`, `fibonacciLine`, `simpleAnnotation`, `simpleTag`

## 覆盖物模版
创建一个模板，然后通过`registerOverlay` 全局添加，添加到图表即可和内置覆盖物一样去使用。
### 属性说明
```javascript
{
  // 名称，必须字段，作为覆盖物创建的唯一标识
  name: 'xxx',

  // 总共需要多少步操作才行绘制完成，非必须
  totalStep: 3,

  // 是否锁定，不触发事件，非必须
  lock: false,

  // 是否需要默认的点对应的图形，非必须
  needDefaultPointFigure: false

  // 是否需要默认的X轴上的图形，非必须
  needDefaultXAxisFigure: false

  // 是否需要默认的Y轴上的图形，非必须
  needDefaultYAxisFigure: false

  // 模式，可选项为`normal`，`weak_magnet`，`strong_magnet`，非必须
  mode: 'normal,

  // 点信息，非必须
  points: []

  // 扩展数据，可以是一个方法，也可以是一个固定值，非必须
  extendData: null

  // 样式，非必须
  styles: null

  // 创建点对应的图形，非必须，返回值是一个图形信息或者图形信息数组，类型为`{ key, type, attrs, styles, ignoreEvent }`
  // key 无实际作用，可以用于一个自定义的标识，可缺省
  // type 图形类型，和图表支持的figures里面的类型一致，可以调用图表方法`getSupportFigures`查看图表所支持的类型，必要字段
  // attrs 属性，和type对应图形的属性一致，可以是单个属性，也可以数组，必要字段
  // styles 样式，和type对应的图形样式一致，可缺省
  // ignoreEvent 是否要忽略事件响应，可缺省

  // overlay 覆盖物实例
  // coordinates 覆盖物点信息对应的坐标
  // bounding 窗口尺寸信息
  // barSpace 数据尺寸信息
  // precision 精度
  // dateTimeFormat 时间格式化
  // defaultStyles 默认的覆盖物样式
  // xAxis x轴
  // yAxis y轴
  createPointFigures: ({
    overlay,
    coordinates,
    bounding,
    barSpace,
    precision,
    dateTimeFormat,
    defaultStyles,
    xAxis,
    yAxis,
  }) => ({ key: 'xxx', type: 'circle', attrs: {}, styles: {}, ignoreEvent: false })

  // 创建X轴上的图形，非必须，返回值和`createPointFigures`一致
  createXAxisFigures: ({
    overlay,
    coordinates,
    bounding,
    barSpace,
    precision,
    dateTimeFormat,
    defaultStyles,
    xAxis,
    yAxis,
  }) => ({ key: 'xxx', type: 'circle', attrs: {}, styles: {}, ignoreEvent: false })

  // 创建Y轴上的图形，非必须，返回值和`createPointFigures`一致
  createYAxisFigures: ({
    overlay,
    coordinates,
    bounding,
    barSpace,
    precision,
    dateTimeFormat,
    defaultStyles,
    xAxis,
    yAxis,
  }) => ({ key: 'xxx', type: 'circle', attrs: {}, styles: {}, ignoreEvent: false })

  // 处理在绘制过程中移动操作，可缺省，移动绘制过程中触发
  // currentStep 当前步骤
  // mode 模式
  // points 覆盖物点信息
  // performPointIndex 对应的点的索引
  // performPoint 对应的点的信息
  performEventMoveForDrawing: ({
    currentStep,
    mode,
    points,
    performPointIndex,
    performPoint
  }) => {},

  // 处理按住移动操作，可缺省，按住某个操作点移动过程中触发
  // 回调参数和`performEventMoveForDrawing`一致
  performEventPressedMove: ({
    currentStep,
    mode,
    points,
    performPointIndex,
    performPoint
  }) => {},

  // 绘制开始回调事件，可缺省
  onDrawStart: (event) => {},

  // 绘制过程中回调事件，可缺省
  onDrawing: (event) => {},

  // 绘制结束回调事件，可缺省
  onDrawEnd: (event) => {},

  // 点击回调事件，可缺省
  onClick: (event) => {},

  // 右击回调事件，可缺省，需要返回一个boolean类型的值，如果返回true，内置的右击删除将无效
  onRightClick: (event) => {},

  // 按住拖动开始回调事件，可缺省
  onPressedMoveStart: (event) => {},

  // 按住拖动回调事件，可缺省  
  onPressedMoving: (event) => {},

  // 按住拖动结束回调事件，可缺省
  onPressedMoveEnd: (event) => {},

  // 鼠标移入事件，可缺省
  onMouseEnter: (event) => {},

  // 鼠标移出事件，可缺省
  onMouseLeave: (event) => {},

  // 删除回调事件，可缺省
  onRemoved: (event) => {},

  // 选中回调事件，可缺省
  onSelected: (event) => {},

  // 取消回调事件，可缺省
  onDeselected: (event) => {}
}
```

## 示例
以一个填充带边框的圆来具体说明如何配置。
```javascript
{
  // 名称
  name: 'sampleCircle',

  // 完成一个圆的绘制需要三个步骤
  totalStep: 3,

  // 创建点对应的图形信息
  createPointFigures: ({ step, points, coordinates }) => {
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
        }
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
