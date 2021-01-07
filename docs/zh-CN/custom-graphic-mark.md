# 自定义图形标记
## 开始
首先说明一下自定义图形标记各个属性
```js
{
  // 名称，必须字段，作为图形标记的唯一标识
  name: 'xxx',

  // 总共需要多少步操作才行绘制完成，必须字段
  totalStep: 3,

  // 检查鼠标点是否在图形上，是一个回调方法，必须字段
  // type 图形类型
  // points 图形点信息
  // mousePoint 当前鼠标点
  // 需要返回boolean值
  checkMousePointOn: (type, points, mousePoint) => {},

  // 创建图形数据源，是一个回调方法，必须字段
  // step 当前步骤
  // tpPoints 时间价格点信息
  // xyPoints 时间价格点对应的坐标轴信息
  // viewport 尺寸
  // precision 精度信息，包含价格和数量精度
  // xAxis x轴组件
  // yAxis y轴组件
  // 需要返回图形数据
  createGraphicDataSource: (step, tpPoints, xyPoints, viewport, precision, xAxis, yAxis) => {},

  // 处理在绘制过程中鼠标移动操作，可缺省
  // step 当前步骤
  // tpPoints 图形时间价格点信息
  // tpPoint 鼠标点对应的时间价格信息
  performMouseMoveForDrawing: (step, tpPoints, tpPoint) => {},

  // 处理鼠标按住移动操作，可缺省
  // tpPoints 图形时间价格点信息
  // pressedPointIndex 按住点的索引
  // tpPoint 鼠标点对应的时间价格信息
  performMousePressedMove: (tpPoints, pressedPointIndex, tpPoint) => {},

  // 扩展绘制，可缺省
  // ctx 画布上下文
  // graphicDataSources 图形数据信息
  // markOptions 图表样式配置
  // viewport 尺寸
  // precision 精度信息，包含价格和数量精度
  // xAxis x轴组件
  // yAxis y轴组件
  drawExtend: (ctx, graphicDataSources, markOptions, viewport, precision, xAxis, yAxis) => {}
}
```
`createGraphicDataSource`返回值是图形信息数组，每一个子项格式如下：<br/>
```js
{
  // 类型，目前支持'line' | 'text' | 'continuous_line' | 'polygon' | 'arc'，是必要字段
  type: 'line',
  // 是否要绘制，可缺省，默认绘制
  isDraw: true,
  // 是否要检查是否在图形上，可缺省，默认不检查
  isCheck: true,
  // 样式，type为'line'和'continuous_line'无效, 仅支持'fill'和'stroke'，可缺省，type为'text'时，默认为'fill'，其它默认为'stroke'
  style: 'stroke',
  // 数据数组，当type是'line'时是二维数组
  dataSource: []
}
```

`dataSource`的子项格式如下：<br/>
```js
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
以一个自定义圆来具体说明
```js
{
  // 名称
  name: 'circle',

  // 完成一个圆的绘制需要三个步骤
  totalStep: 3,

  // 检查鼠标点是否在圆边框上
  checkMousePointOn: (type, points, mousePoint) => {
    const xDis = Math.abs(points.x - mousePoint.x)
    const yDis = Math.abs(points.y - mousePoint.y)
    const r = Math.sqrt(xDis * xDis + yDis * yDis)
    return Math.abs(r - points.radius) < 3;
  },

  // 创建图形信息
  createGraphicDataSource: (step, tpPoint, xyPoints) => {
    if (xyPoints.length === 2) {
      const xDis = Math.abs(xyPoints[0].x - xyPoints[1].x)
      const yDis = Math.abs(xyPoints[0].y - xyPoints[1].y)
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
          style: 'fill',
          // 点信息
          dataSource: [
            { ...xyPoints[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
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
            { ...xyPoints[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ]
        }
      ]
    }
    return []
  }
}
```
以上就完成了一个名为`circle`的图形标记，可以通过`extension.addGraphicMark`全局添加，也通过图表实例方法`addCustomGraphicMark`为单个图表实例添加。
添加到图表即可和内置的图形标记一样去使用。
