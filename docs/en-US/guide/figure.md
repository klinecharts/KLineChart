# Figure
Figure are an important part of the chart. All elements on the chart are composed of figures. If you need to make complex custom technical indicators and overlays, it is recommended to read carefully. This document describes the built-in figures and how to customize a figure. The basic figure can be obtained through the chart method `klinecharts.getFigureClass(name)`.

## Example of use
::: warning Note
It needs to be used when there is a canvas context.
:::

```javascript
// Get the figure class
// name is the name of the figure, such as 'arc', 'circle', etc.
const Figure = klinecharts.getFigureClass(name)
// instantiate and draw
// attrs attribute
// styles styles
// ctx canvas context
new Figure(attrs, styles).draw(ctx)
```

## Built-in figures
These figures are built into the chart, `arc`, `circle`, `line`, `polygon`, `rect`, `text`, `rectText`.
### arc
```typescript
new ({
   attrs: {
     // The x-axis coordinate value of the center of the circle
     x: number
     // The y-axis coordinate value of the center of the circle
     y: number
     // radius
     r: number
     // start angle
     startAngle: number
     // end angle
     endAngle: number
   },
   styles: {
     // style, optional `solid`, `dashed`
     style?: 'solid' | 'dashed'
     // size
     size?: number
     // color
     color?: string
     // dotted line parameter
     dashedValue?: number[]
   }
}) => Figure
```

### circle
```typescript
new ({
   attrs: {
     // The x-axis coordinate value of the center of the circle
     x: number
     // The y-axis coordinate value of the center of the circle
     y: number
     // radius
     r: number
   },
   styles: {
     // style, optional `fill`, `stroke`, `stroke_fill`
     style?: 'fill' | 'stroke' | 'stroke_fill'
     // color
     color?: string
     // border style
     borderStyle?: 'solid' | 'dashed'
     // border color
     borderColor?: string
     // frame size
     borderSize?: number
     // border dotted line parameters
     borderDashedValue?: number[]
   }
}) => Figure
```

### line
```typescript
new ({
  attrs: {
    // set of coordinates
    coordinates: Array<{
      x: number
      y: number
    }>
  },
  styles: {
    // style, optional `solid`, `dashed`
    style?: 'solid' | 'dashed'
    // size
    size?: number
    // color
    color?: string
    // dotted line parameter
    dashedValue?: number[]
  }
}) => Figure
```

###polygon
```typescript
new ({
  attrs: {
    // set of coordinates
    coordinates: Array<{
      x: number
      y: number
    }>
  },
  styles: {
    // style, optional `fill`, `stroke`, `stroke_fill`
    style?: 'fill' | 'stroke' | 'stroke_fill'
    // color
    color?: string
    // border style
    borderStyle?: 'solid' | 'dashed'
    // border color
    borderColor?: string
    // frame size
    borderSize?: number
    // border dotted line parameter
    borderDashedValue?: number[]
  }
}) => Figure
```

### rect
```typescript
new ({
  attrs: {
    // The x-axis coordinate value of the starting point
    x: number
    // The y-axis coordinate value of the starting point
    y: number
    // width
    width: number
    // high
    height: number
  },
  styles: {
    // style, optional `fill`, `stroke`, `stroke_fill`
    style?: 'fill' | 'stroke' | 'stroke_fill'
    // color
    color?: string
    // border style
    borderStyle?: 'solid' | 'dashed'
    // border color
    borderColor?: string
    // frame size
    borderSize?: number
    // border dotted line parameters
    borderDashedValue?: number[]
    // Border fillet value
    borderRadius?: number
  }
}) => Figure
```

### text
```typescript
new ({
  attrs: {
    // The x-axis coordinate value of the starting point
    x: number
    // The y-axis coordinate value of the starting point
    y: number
    // Fixed width
    width: number
    // Fixed height
    height: number
    // text content
    text: any
    // alignment
    align: CanvasTextAlign
     // benchmark
    baseline: CanvasTextBaseline
  },
  styles: {
    // style, optional `fill`, `stroke`, `stroke_fill`
    style?: 'fill' | 'stroke' | 'stroke_fill'
    // color
    color?: string
    // size
    size?: number
    // font
    family?: string
    // thickness
    weight?: string | number
    // left padding
    paddingLeft?: number
    // right padding
    paddingRight?: number
    // top padding
    paddingTop?: number
    // Bottom padding
    paddingBottom?: number
    // border style
    borderStyle?: 'solid' | 'dashed'
    // border color
    borderColor?: string
    // frame size
    borderSize?: number
    // border dotted line parameter
    borderDashedValue?: number[]
    // Border fillet value
    borderRadius?: number
    // background color
    backgroundColor?: string | CanvasGradient
  }
}) => Figure
```

### rectText
Same as `text`, it is deprecated and will be deleted after v10. Please use `text` instead.

## Customize figure
To create a custom figure, you only need to generate the figure information, and then add it globally through `klinecharts.registerFigure`, and add it to the chart to use it like the built-in figures.

### Attribute description
```typescript
{
  // Figure name, a required field, is the unique identifier for creation
  name: string

  // Check whether the event is on the graph, return a boolean value
  checkEventOn: (
    // coordinates of the event
    coordinate: {
      x: number
      y: number
    },
    // graphics properties
    attrs: any,
     // style of the graph
    styles: any
  ) => boolean

  // draw
  draw: (
    // canvas context
    ctx: CanvasRenderingContext2D,
    // figure properties
    attrs: any,
    // style of the figure
    styles: any
  ) => void
}
```

### Example
The customization is specified with a diamond that can have a border and a background.

#### Step.1
First determine the attributes and styles.
Attribute `{ x, y, width, height }`, `x` is the x-axis coordinate value of the center point, `y` is the y-axis coordinate value of the center point, `width` is the width, and `height` is the height.
Style `{ style, color, borderStyle, borderSize, borderColor, dashedValue }`, `style` is the style type, we can define three options `stroke`, `fill`, `stroke_fill`, `stroke` has only a border, `fill `Only the background, `stroke_fill` has a border and a background, `color` is the color, `borderStyle` is the border style, you can define two options `solid` and `dashed`, `solid` is a solid line, `dashed` is a dashed line, `borderSize` is the border size, `borderColor` is the border color, and `dashedValue` is the dashed line value.

#### Step.2
Implement `checkEventOn` and `draw` two methods.
```javascript
{
   name: 'diamond',
   checkEventOn: (coordinate, attrs) => {
     const { x, y, width, height } = attrs
     const xDis = Math.abs(coordinate.x - x)
     const yDis = Math.abs(coordinate.y - y)
     return xDis * height + yDis * width < width * height / 2
   },
   draw: (ctx, attrs, styles) => {
     const { x, y, width, height } = attrs
     const {
       style = 'fill',
       color = 'currentColor',
       borderSize = 1,
       borderColor = 'currentColor',
       borderStyle = 'solid,
       borderDashedValue = [2, 2]
     } = styles
     // Draw a filled diamond
     if (style === 'fill' || styles.style === 'stroke_fill') {
       ctx.fillStyle = color
       ctx.beginPath()
       ctx.moveTo(x - width / 2, y)
       ctx.lineTo(x, y - height / 2)
       ctx.lineTo(x + width / 2, y)
       ctx.lineTo(x, y + height / 2)
       ctx. closePath()
       ctx.fill()
     }
     // Draw a border diamond
     if (style === 'stroke' || styles.style === 'stroke_fill') {
       ctx.strokeStyle = borderColor
       ctx.lineWidth = borderSize
       if (borderStyle === 'dashed') {
         ctx.setLineDash(borderDashedValue)
       } else {
         ctx. setLineDash([])
       }
       ctx.beginPath()
       ctx.beginPath()
       ctx.moveTo(x - width / 2, y)
       ctx.lineTo(x, y - height / 2)
       ctx.lineTo(x + width / 2, y)
       ctx.lineTo(x, y + height / 2)
       ctx. closePath()
       ctx.stroke()
     }
   }
}
```
So a custom figure is completed.
