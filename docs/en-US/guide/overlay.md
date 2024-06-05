# Overlay
This document introduces the built-in overlays in the chart and how to customize a overlay.

## Built-in overlay types
`horizontalRayLine`, `horizontalSegment`, `horizontalStraightLine`, `verticalRayLine`, `verticalSegment`, `verticalStraightLine`, `rayLine`, `segment`, `straightLine`, `priceLine`, `priceChannelLine`, `parallelL`filineLine`, ci `, `simpleAnnotation`, `simpleTag`

## Custom overlays
Customize an overlay, then add it globally through `klinecharts.registerOverlay`, add it to the chart and use it like the built-in overlay.
### Attribute description
```typescript
{
  // Name, a required field, used as the unique identifier for overlay creation
  name: string

  // How many steps are needed in total to complete the drawing, not necessary
  totalStep?: number

  // Whether to lock, do not trigger events, not necessary
  lock?: boolean

  // Do you need visible
  visible?: boolean

  // Draw level
  zLevel?: number

  // Do you need the graphics corresponding to the default points, not necessary
  needDefaultPointFigure?: boolean

  // Do you need the graphics on the default X-axis, not necessary
  needDefaultXAxisFigure?: boolean

  // Do you need the graphics on the default Y axis, not necessary
  needDefaultYAxisFigure?: boolean

  // mode, options are `normal`, `weak_magnet`, `strong_magnet`, not required
  mode?: 'normal' | 'weak_magnet' | 'strong_magnet'

  // mode sensitivity, only valid when mode is weak_magnet
  modeSensitivity?: number

  // point information, not required
  points?: Array<{
    // timestamp
    timestamp: number
    // data index
    dataIndex?: number
    // corresponding to the value of the y-axis
    value?: number
  }>,

  // Extended data, not required
  extendData?: any

  // style, not required, the type participates in the overlay in [style]
  styles?: OverlayStyle

  // Create graphics corresponding to points, not required
  createPointFigures: ({
    // overlay instance
    overlay: Overlay
    // coordinate information corresponding to points
    coordinates: Array<{
      x: number
      y: number
    }>
    // window size information
    bounding: {
      // width
      width: number
      // high
      height: number
      // distance to the left
      left: number
      // distance to the right
      right: number
      // distance from top
      top: number
      // distance from bottom
      bottom: number
    }
    // information about the size of the candlestick
    barSpace: {
      // candlestick size
      bar: number
      halfBar: number
      // candlesticks do not include dimensions of gaps between candlesticks
      gapBar: number
      halfGapBar: number
    }
    // precision
    precision: {
      // price precision
      price: number
      // Quantity precision
      volume: number
    }
    // thousands separator
    thousandsSeparator: string
    // decimal fold threshold
    decimalFoldThreshold: number
    // Constructor for objects that format date and time, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat for details
    dateTimeFormat: Intl. DateTimeFormat
    // The default style, that is, the overlay in the global style configuration, the type participates in the overlay in [style]
    defaultStyles: OverlayStyle
    // x-axis component, some built-in conversion methods
    xAxis: XAxis
    // y-axis component, with some built-in conversion methods
    yAxis: YAxis
  }) => ({
    // No special meaning, can be used for extension fields
    key?: string
    // Graphic type, one of the return values of klinecharts.getSupportFigures
    type: string
    // The properties of the graphic corresponding to the type
    attrs: any | any[]
    // The style of the graphic corresponding to type
    styles?: any
    // Whether to ignore the event
    ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
  }) | Array<{
    key?: string
    type: string
    attrs: any | any[]
    styles?: any
    ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
  }>

  // Create graphics on the X axis, not required, parameters and return values are consistent with `createPointFigures`
  createXAxisFigures?: OverlayCreateFiguresCallback

  // Create graphics on the Y axis, not required, parameters and return values are consistent with `createPointFigures`
  createYAxisFigures?: OverlayCreateFiguresCallback

  // Handle the movement operation during the drawing process, which can be defaulted and triggered during the movement drawing process
  performEventMoveForDrawing?: ({
    // current step
    currentStep: number
    // model
    mode: 'normal' | 'weak_magnet' | 'strong_magnet'
    // point information
    points: Array<{
      // timestamp
      timestamp: number
      // data index
      dataIndex?: number
      // corresponding to the value of the y-axis
      value?: number
    }>
    // index of the event point
    performPointIndex: number
    // Information about the point where the event is located
    performPoint: {
      // timestamp
      timestamp: number
      // data index
      dataIndex?: number
      // corresponding to the value of the y-axis
      value?: number
    }
  }) => void

  // Handle the press and move operation, which can be defaulted, and is triggered during the movement of a certain operation point
  // The callback parameters are consistent with `performEventMoveForDrawing`
  performEventPressedMove?: (params: OverlayPerformEventParams) => void

  // draw start callback event, can be default
  onDrawStart?: (event: OverlayEvent) => boolean

  // callback event during drawing, can be defaulted
  onDrawing?: (event: OverlayEvent) => boolean

  // Draw end callback event, can be default
  onDrawEnd?: (event: OverlayEvent) => boolean

  // click callback event, default
  onClick?: (event: OverlayEvent) => boolean

  // double click callback event, default
  onDoubleClick?: (event: OverlayEvent) => boolean

  // The right-click callback event, which can be defaulted, needs to return a value of type boolean. If it returns true, the built-in right-click delete will be invalid
  onRightClick?: (event: OverlayEvent) => boolean

  // Hold down and drag to start the callback event, which can be defaulted
  onPressedMoveStart?: (event: OverlayEvent) => boolean

  // Press and hold the drag callback event, which can be defaulted
  onPressedMoving?: (event: OverlayEvent) => boolean

  // Hold down and drag to end the callback event, which can be defaulted
  onPressedMoveEnd?: (event: OverlayEvent) => boolean

  // Mouse move event, can be default
  onMouseEnter?: (event: OverlayEvent) => boolean

  // Mouse out event, default
  onMouseLeave?: (event: OverlayEvent) => boolean

  // delete callback event, default
  onRemoved?: (event: OverlayEvent) => boolean

  // Select the callback event, which can be defaulted
  onSelected?: (event: OverlayEvent) => boolean

  // cancel callback event, default
  onDeselected?: (event: OverlayEvent) => boolean
}
```

### Example
A filled, bordered circle is used to illustrate how to configure.
```javascript
{
   // name
   name: 'sampleCircle',

   // Three steps are required to complete the drawing of a circle
   totalStep: 3,

   // Create the graphic information corresponding to the point
   createPointFigures: ({ scoordinates }) => {
     if (coordinates. length === 2) {
       const xDis = Math.abs(coordinates[0].x - coordinates[1].x)
       const yDis = Math.abs(coordinates[0].y - coordinates[1].y)
       // Determine the coordinates of the circle generated by the corresponding point
       const radius = Math. sqrt(xDis * xDis + yDis * yDis)
       // The chart has built-in basic graphics 'circle', which can be used directly
       return {
         key: 'sampleCircle',
         type: 'circle',
         attrs: {
           ...coordinates[0],
           r: radius
         },
         styles: {
           // Select the border and fill it, other selections use the default style
           style: 'stroke_fill'
         }
       }
     }
     return []
   }
}
```
So a custom overlay is complete.