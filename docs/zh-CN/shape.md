# 图形

## 默认图形类型
`horizontalRayLine`, `horizontalSegment`, `horizontalStraightLine`, `verticalRayLine`, `verticalSegment`, `verticalStraightLine`, `rayLine`, `segment`, `horizontalSegment`, `priceLine`, `priceChannelLine`, `parallelStraightLine`, `fibonacciLine`

## 图形模板
创建一个模板，然后通过`extension.addShapeTemplate` 全局添加，或者通过图表实例方法`addShapeTemplate` 为单个图表实例添加即可。添加到图表即可和内置图形一样去使用。
### 属性说明
#### 图形信息
```javascript
{
  // 名称，必须字段，作为图形标记的唯一标识
  name: 'xxx',

  // 总共需要多少步操作才行绘制完成，必须字段
  totalStep: 3,

  // 检查鼠标点是否在图形上，是一个回调方法，必须字段
  // key 创建数据源的时候给的key
  // type 图形类型
  // dataSource 图形信息
  // eventCoordinate 当前事件坐标
  // 需要返回boolean值
  checkEventCoordinateOnShape: ({ key, type, dataSource, eventCoordinate }) => {},

  // 创建图形数据源，是一个回调方法，必须字段，需要返回图形数据
  // step 当前步骤
  // points 时间价格点信息
  // coordinates 时间价格点对应的坐标轴信息
  // viewport 尺寸
  // precision 精度信息，包含价格和数量精度
  // styles 样式
  // xAxis x轴组件
  // yAxis y轴组件
  // data 外部数据
  createShapeDataSource: ({ step, points, coordinates, viewport, precision, styles, xAxis, yAxis, data }) => {},

  // 处理在绘制过程中鼠标移动操作，可缺省，鼠标操作绘制过程中触发
  // step 当前步骤
  // points 图形时间价格点信息
  // movePoint 移动对应的点
  // xAxis x轴组件
  // yAxis y轴组件
  performEventMoveForDrawing: ({ step, points, movePoint, xAxis, yAxis }) => {},

  // 处理鼠标按住移动操作，可缺省，鼠标按住某个操作点移动过程中触发
  // points 图形时间价格点信息
  // pressPointIndex 按住点的索引
  // pressPoint 按住对应的点
  // xAxis x轴组件
  // yAxis y轴组件
  performEventPressedMove: ({ points, pressPointIndex, pressPoint, xAxis, yAxis }) => {},

  // 扩展绘制，可缺省
  // ctx 画布上下文
  // dataSource 图形数据信息
  // styles 图表样式配置
  // viewport 尺寸
  // precision 精度信息，包含价格和数量精度
  // xAxis x轴组件
  // yAxis y轴组件
  // data 外部数据
  drawExtend: ({ ctx, dataSource, styles, viewport, precision, xAxis, yAxis, data }) => {}
}
```
#### 方法createShapeDataSource返回值子项信息
```javascript
{
  // key
  key: 'key'
	// 类型，目前支持'line' | 'text' | 'continuous_line' | 'polygon' | 'arc'，是必要字段
  type: 'line',
  // 是否要绘制，可缺省，默认绘制
  isDraw: true,
  // 是否要检查是否在图形上，可缺省，默认不检查
  isCheck: true,
  // 样式
  styles: {},
  // 数据数组，当type是'line'时是二维数组
  dataSource: []
}
```
#### dataSource子项信息
```javascript
{
  // x坐标，必要字段
  x: 123,
  // y坐标，必要字段
  y: 123,
  // 半径，当type为'arc'时需要
  radius: 5,
  // 起始角度，当type为'arc'时需要
  startAngle: 0,
  // 结束角度，当type为'arc'时需要
  endAngle: 180,
  // 文字，当type为'text'时需要
  text: '',
}
```


## 示例
以一个填充带边框的圆来具体说明如何配置。
```javascript
{
  // 名称
  name: 'circle',

  // 完成一个圆的绘制需要三个步骤
  totalStep: 3,

  // 检查事件坐标是否在圆边框上
  checkEventCoordinateOnShape: ({ dataSource, eventCoordinate }) => {
    const xDis = Math.abs(dataSource.x - eventCoordinate.x)
    const yDis = Math.abs(dataSource.y - eventCoordinate.y)
    const r = Math.sqrt(xDis * xDis + yDis * yDis)
    return Math.abs(r - dataSource.radius) < 2;
  },

  // 创建图形信息
  createShapeDataSource: ({ step, points, coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x)
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y)
      const radius = Math.sqrt(xDis * xDis + yDis * yDis)
      // 通过一个空心圆和一个实心圆来组成一个填充带边框的圆
      return [
        // 实心圆
        {
          type: 'arc',
          isDraw: true,
          // 实心圆，不用去检查鼠标点是否在图形上
          isCheck: false,
          // 填充
          styles: { style: 'fill'  },
          // 点信息
          dataSource: [
            { ...coordinates[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ]
        },
        // 空心圆
        {
          type: 'arc',
          isDraw: true,
          // 需要检查是否在边框上
          isCheck: true,
          // 点信息
          dataSource: [
            { ...coordinates[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ]
        }
      ]
    }
    return []
  }
}
```
