# Graphic mark

## Default graphic mark
`horizontalRayLine`, `horizontalSegment`, `horizontalStraightLine`, `verticalRayLine`, `verticalSegment`, `verticalStraightLine`, `rayLine`, `segment`, `horizontalSegment`, `priceLine`, `priceChannelLine`, `parallelStraightLine`, `fibonacciLine`

## Graphic mark template
Create a graphic mark template, and then add it globally through `extension.addGraphicMarkTemplate`, or add it for a single graph instance through the chart instance method `addCustomGraphicMarkTemplate`. Adding to the chart can be used like the built-in graphic markers.
### Property description
#### Graphic mark information
```js
{
  // Name, a required field, as the unique identifier of the graphic mark
  name:'xxx',

  // How many steps are required to complete the drawing, the required fields
  totalStep: 3,

  // Check whether the mouse point is on the graph, it is a callback method, a required field
  // key The key given when creating the data source
  // type graphics type
  // dataSource graphic information
  // eventCoordinate current mouse coordinate
  // Need to return boolean value
  checkEventCoordinateOnGraphic: ({ key, type, dataSource, eventCoordinate }) => {},

  // Creating a graphic data source is a callback method. It must be a field and needs to return graphic data
  // step current step
  // points time price point information
  // coordinates time price point corresponding axis information
  // viewport size
  // precision precision information, including price and quantity precision
  // styles style
  // xAxis x-axis component
  // yAxis y axis component
  createGraphicDataSource: ({ step, points, coordinates, viewport, precision, styles, xAxis, yAxis }) => {},

  // Process the mouse movement operation during the drawing process, it can be defaulted, and the mouse operation is triggered during the drawing process
  // step current step
  // points graph time price point information
  // movePoint time and price information corresponding to the move point
  // xAxis x-axis component
  // yAxis y axis component
  performEventMoveForDrawing: ({ step, points, movePoint, xAxis, yAxis }) => {},

  // Handle the mouse hold and move operation, it can be defaulted, the mouse is triggered during the movement process of holding down an operating point
  // points graph time price point information
  // pressPointIndex The index of the pressed point
  // pressPoint time and price information corresponding to the press point
  // xAxis x-axis component
  // yAxis y axis component
  performEventPressedMove: ({ points, pressPointIndex, pressPoint, xAxis, yAxis }) => {},

  // Extended drawing, default
  // ctx canvas context
  // dataSource graphic data information
  // styles chart style configuration
  // viewport size
  // precision precision information, including price and quantity precision
  // xAxis x-axis component
  // yAxis y axis component
  drawExtend: ({ ctx, dataSource, styles, viewport, precision, xAxis, yAxis }) => {}
}
```
#### Method createGraphicDataSource return value sub-item information
```js
{
  // key
  key:'key'
  // Type, currently supports 'line' | 'text' | 'continuous_line' | 'polygon' | 'arc', which is a necessary field
  type:'line',
  // Whether you want to draw, you can default, draw by default
  isDraw: true,
  // Whether to check whether it is on the graph, it can be defaulted, not checked by default
  isCheck: true,
  // Style
  styles: {},
  // Data array, when type is 'line', it is a two-dimensional array
  dataSource: []
}
```
#### dataSource sub-item information
```javascript
{
  // x coordinate, required field
  x: 123,
  // y coordinate, necessary field
  y: 123,
  // radius, needed when type is 'arc'
  radius: 5,
  // Starting angle, required when type is 'arc'
  startAngle: 0,
  // End angle, required when type is 'arc'
  endAngle: 180,
  // text, required when type is 'text'
  text: '',
}
```


## Example
Use a filled circle with a border to illustrate how to configure it.
```javascript
{
  // name
  name:'circle',

  // It takes three steps to complete the drawing of a circle
  totalStep: 3,

  // Check if the event coordinate is on the circle border
  checkEventCoordinateOnGraphic: ({ dataSource, eventCoordinate }) => {
    const xDis = Math.abs(dataSource.x - eventCoordinate.x)
    const yDis = Math.abs(dataSource.y - eventCoordinate.y)
    const r = Math.sqrt(xDis * xDis + yDis * yDis)
    return Math.abs(r - points.radius) < 2;
  },

  // Create graphic information
  createGraphicDataSource: ({ step, points, coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x)
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y)
      const radius = Math.sqrt(xDis * xDis + yDis * yDis)
      // A circle filled with a border is formed by a hollow circle and a solid circle
      return [
        // filled circle
        {
          type: 'arc',
          isDraw: true,
          // Filled circle, no need to check whether the mouse point is on the graph
          isCheck: false,
          // fill
          styles: { style: 'fill' },
          // point information
          dataSource: [
            {...coordinates[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ]
        },
        // hollow circle
        {
          type:'arc',
          isDraw: true,
          // Need to check if it is on the border
          isCheck: true,
          // point information
          dataSource: [
            {...coordinates[0], radius, startAngle: 0, endAngle: Math.PI * 2 },
          ]
        }
      ]
    }
    return []
  }
}
```
