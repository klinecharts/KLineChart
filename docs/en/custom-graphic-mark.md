# Custom graphic mark
## Start
First explain the attributes of the custom graphic mark
```
{
  // Name, a required field, as the unique identifier of the graphic mark
  name: 'xxx',

  // How many steps are required to complete the drawing, the required fields
  totalStep: 3,

  // Check whether the mouse point is on the graph, it is a callback method, a required field
  // type: graphic type
  // points: graphic point information
  // mousePoint: current mouse point
  // Need to return boolean value
  checkMousePointOn: (type, points, mousePoint) => {},

  // Create a graphical data source, a callback method, required fields
  // step: current step
  // tpPoints: time price point information
  // xyPoints: time price point corresponding axis information
  // viewport: size
  // precision: precision information, including price and quantity precision
  // xAxis: x-axis component
  // yAxis: y axis component
  // Need to return graphic data
  createGraphicDataSource: (step, tpPoints, xyPoints, viewport, precision, xAxis, yAxis) => {},

  // Process the mouse movement operation during the drawing process, can be default
  // step: current step
  // tpPoints: graph time price point information
  // tpPoint: time and price information corresponding to the mouse point
  performMouseMoveForDrawing: (step, tpPoints, tpPoint) => {},

  // Handle mouse press and move operation, default
  // tpPoints: graph time price point information
  // pressedPointIndex: the index of the pressed point
  // tpPoint: time and price information corresponding to the mouse point
  performMousePressedMove: (tpPoints, pressedPointIndex, tpPoint) => {},

  // Extended drawing, default
  // ctx: canvas context
  // graphicDataSources: graphic data information
  // markOptions: chart style configuration
  // viewport: size
  // precision: precision information, including price and quantity precision
  // xAxis: x-axis component
  // yAxis: y axis component
  drawExtend: (ctx, graphicDataSources, markOptions, viewport, precision, xAxis, yAxis) => {}
}
```
The return value of `createGraphicDataSource` is an array of graphics information, and the format of each sub-item is as follows:<br/>
```
{
  // Type, currently supports 'line' | 'text' | 'continuous_line' |'polygon' |'arc', which is a necessary field
  type: 'line',

  // Whether you want to draw, you can default, draw by default
  isDraw: true,

  // Whether to check whether it is on the graph, it can be defaulted, not checked by default
  isCheck: true,

  // Style, type is'line' and'continuous_line' are invalid, only supports'fill' and'stroke', which can be defaulted, when type is'text', the default is'fill', others default to'stroke'
  style: 'stroke',

  // Data array, when type is 'line', it is a two-dimensional array.
  dataSource: []
}
```

The format of the sub-items of `dataSource` is as follows:<br/>
```
{
  // x coordinate, required field
  x: 123,
  // y coordinate, required field
  y: 123,
  // radius, needed when type is'arc'
  radius: 5,
  // start angle, required when type is 'arc'
  startAngle: 0,
  // end angle, required when type is 'arc'
  endAngle: 180,
  // text, required when type is 'text'
  text: ''
}
```

## Example
Specify with a custom circle.
```
{
  // Name
  name: 'circle',

  // Three steps are required to complete a circle
  totalStep: 3,

  // Check if the mouse point is on the circle border
  checkMousePointOn: (type, points, mousePoint) => {
    const xDis = Math.abs(points.x - mousePoint.x)
    const yDis = Math.abs(points.y - mousePoint.y)
    const r = Math.sqrt(xDis * xDis + yDis * yDis)
    return Math.abs(r - points.radius) < 3;
  },

  // Create graphic information
  createGraphicDataSource: (step, tpPoint, xyPoints) => {
    if (xyPoints.length === 2) {
      const xDis = Math.abs(xyPoints[0].x - xyPoints[1].x)
      const yDis = Math.abs(xyPoints[0].y - xyPoints[1].y)
      const radius = Math.sqrt(xDis * xDis + yDis * yDis)
      // A circle filled with a border is formed by a hollow circle and a solid circle
      return [
        // Filled circle
        {
          type: 'arc',
          isDraw: true,
          // Filled circle, no need to check whether the mouse point is on the graph
          isCheck: false,
          // Fill
          style: 'fill',
          // Point infomation
          dataSource: [
            { ...xyPoints[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ]
        },
        // Hollow circle
        {
          type: 'arc',
          isDraw: true,
          // Need to check if it is on the border
          isCheck: true,
          // Point infomation
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
The above completes a graphic mark named `circle`, which can be added global through `extension.addGraphicMark`, or added for a single chart instance through the chart instance method `addCustomGraphicMark`.
Adding to the chart can be used like the built-in graphic markers.
