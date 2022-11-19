# Overlay

## Default overlay type
`horizontalRayLine`, `horizontalSegment`, `horizontalStraightLine`, `verticalRayLine`, `verticalSegment`, `verticalStraightLine`, `rayLine`, `segment`, `straightLine`, `priceLine`, `priceChannelLine`, `parallelStraightLine`, `fibonacciLine`, `simpleAnnotation`, `simpleTag`

## Overlay template
Create a template, and then add it globally through 'registerOverlay'. Adding it to a chart can be used as a built-in overlay.

### Template attribute description

```javascript
{
  // Is used as the unique identifier for covering creation, required field
  name: 'xxx',

  // How many steps are required to complete the drawing, not required
  totalStep: 3,

  // Whether to lock, do not trigger the event, not required
  lock: false,

  // Whether the figure corresponding to the default point is required, not required
  needDefaultPointFigure: false

  // Whether the default X axis figure is required, not required
  needDefaultXAxisFigure: false

  // Whether the default Y axis figure is required, not required
  needDefaultYAxisFigure: false

  // Mode, options are 'normal', 'weak_magnet`，`strong_magnet ', not required
  mode: 'normal,

  // Point information, not required
  points: []

  // Extended data, which can be a method or a fixed value, not required
  extendData: null

  // Style, not required
  styles: null

  // It is not necessary to create a figure corresponding to a point. The return value is a figure information or an array of graph information. The type is `{ key, type, attrs, styles, ignoreEvent }`
  // key The key has no practical effect. It can be used for a user-defined identifier, which can be defaulted
  // type Type is consistent with the types in figures supported by the chart. You can call the chart method `getSupportFigures` to view the types supported by the chart and the required fields
  // attrs The attrs attribute is consistent with the attributes of the figure corresponding to type. It can be a single attribute, an array, or a required field
  // styles Style, consistent with the figure style corresponding to type, can be defaulted
  // ignoreEvent Whether to ignore the event response, you can default

  // overlay Overlay instance
  // coordinates Coordinates corresponding to the covering point information
  // bounding Window size information
  // barSpace Data size information
  // precision
  // dateTimeFormat
  // defaultStyles Default overlay style
  // xAxis X axis component
  // yAxis Y axis component
  createPointFigures: ({
    overlay,
    coordinates,
    bounding,
    barSpace,
    precision,
    dateTimeFormat,
    defaultStyles,
    xAxis,
    yAxis
  }) => ({ key: 'xxx', type: 'circle', attrs: {}, styles: {}, ignoreEvent: false })

  // It is not necessary to create a figure on the X axis. The return value is consistent with 'createPointFigures'
  createXAxisFigures: ({
    overlay,
    coordinates,
    bounding,
    barSpace,
    precision,
    dateTimeFormat,
    defaultStyles,
    xAxis,
    yAxis
  }) => ({ key: 'xxx', type: 'circle', attrs: {}, styles: {}, ignoreEvent: false })

  // It is not necessary to create a figure on the Y axis. The return value is consistent with 'createPointFigures'
  createYAxisFigures: ({
    overlay,
    coordinates,
    bounding,
    barSpace,
    precision,
    dateTimeFormat,
    defaultStyles,
    xAxis,
    yAxis
  }) => ({ key: 'xxx', type: 'circle', attrs: {}, styles: {}, ignoreEvent: false })

  // Processing the move operation in the drawing process, which can be defaulted and triggered in the moving drawing process
  // currentStep Current step
  // mode
  // points Overlay point information
  // performPointIndex Index of the point corresponding
  // performPoint Information of the point corresponding

  performEventMoveForDrawing: ({
    currentStep,
    mode,
    points,
    performPointIndex,
    performPoint
  }) => {},

  // Handle the press and hold movement operation, which can be defaulted, and is triggered when pressing and holding an operation point to move
  // The callback parameters are consistent with 'performEventMoveForDrawing'

  performEventPressedMove: ({
    currentStep,
    mode,
    points,
    performPointIndex,
    performPoint
  }) => {},

  // Draw the start callback event by default
  onDrawStart: (event) => {},

  // Callback event during drawing, which can be defaulted
  onDrawing: (event) => {},

  // Draw the end callback event by default
  onDrawEnd: (event) => {},

  // Click the callback event to default
  onClick: (event) => {},

  // Right click the callback event. By default, a boolean type value needs to be returned. If true is returned, the built-in right-click deletion will be invalid
  onRightClick: (event) => {},

  // Press and drag to start callback event, which can be defaulted
  onPressedMoveStart: (event) => {},

  // Press and hold the drag callback event to default
  onPressedMoving: (event) => {},

  // Press and drag to end the callback event, which can be defaulted
  onPressedMoveEnd: (event) => {},

  // Mouse in event, which can be defaulted
  onMouseEnter: (event) => {},

  // Mouse out event, which can be defaulted
  onMouseLeave: (event) => {},

  // Delete callback event by default
  onRemoved: (event) => {},

  // Select the callback event to default
  onSelected: (event) => {},

  // Cancel callback event, which can be defaulted

  onDeselected: (event) => {}
}
```

## Example
A circle filled with a border is used to specify how to configure.

```javascript
{
  name: 'sampleCircle',

  // It takes three steps to complete the drawing of a circle
  totalStep: 3,

  // Create figures information corresponding to points
  createPointFigures: ({ step, points, coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x)
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y)
      // Determine the coordinates of the circle generated by the corresponding point
      const radius = Math. sqrt(xDis * xDis + yDis * yDis)
      // The chart has built-in basic graph 'circle', which can be used directly
      return {
        key: 'sampleCircle',
        type: 'circle',
        attrs: {
          ...coordinates[0],
          r: radius
        }
        styles: {
          // Select the border and fill, and use the default style for other selections
          style: 'stroke_ fill'
        }
      }
    }
    return []
  }
}

```