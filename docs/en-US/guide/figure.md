<script setup>
import Tip from '../../@components/Tip.vue'
</script>

# Figure
Figure is the smallest rendering unit in the chart. Indicators, overlays, and some interactive elements are all finally rendered through figures. If you are going to build custom indicators or custom overlays, this guide is recommended first.

Figure class can be obtained through `klinecharts.getFigureClass(name)`.

## Example of use
<Tip type="warn" title="Note" :tip="['It needs to be used when there is a canvas context.']"/>

```javascript
// Get the figure class
// name is the name of the figure, such as 'arc', 'circle', etc.
const Figure = klinecharts.getFigureClass(name)
// instantiate and draw
// attrs attribute
// styles styles
// ctx canvas context
new Figure({ attrs, styles }).draw(ctx)
```

## Common conventions
- Built-in figures usually support both a single object and an array in `attrs`, which is convenient for batch drawing.
- Hit testing is defined by `checkEventOn`; each figure may use different hit rules.
- `styles` can be partially provided. Unspecified fields use figure-level defaults.

## Built-in figures
These figures are built into the chart: `arc`, `circle`, `line`, `polygon`, `rect`, `text`, `path`.
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
    // smoothing, true means default smoothing; number is suggested in 0 ~ 1
    smooth?: boolean | number
    // size
    size?: number
    // color
    color?: string
    // dotted line parameter
    dashedValue?: number[]
  }
}) => Figure
```

### polygon
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
    // text content
    text: string
    // Fixed width
    width?: number
    // Fixed height
    height?: number
    // alignment
    align?: CanvasTextAlign
    // baseline
    baseline?: CanvasTextBaseline
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

### path
```typescript
new ({
  attrs: {
    // offset x of the path (applied to absolute path commands)
    x: number
    // offset y of the path (applied to absolute path commands)
    y: number
    // hit test width
    width: number
    // hit test height
    height: number
    // SVG path string, supports M/L/H/V/C/S/Q/T/A/Z and lowercase relative commands
    path: string
  },
  styles: {
    // style, optional `stroke`, `fill`
    style?: 'stroke' | 'fill'
    // color
    color?: string
    // line width (works when style is `stroke`)
    lineWidth?: number
  }
}) => Figure
```

## Customize figure
To create a custom figure, you only need to generate the basic figure information, and then add it globally through the chart API [registerFigure(figure)](/en-US/api/chart/registerFigure) , and add it to the chart to use it like a built-in basic figure. For more examples, refer to the files under [https://github.com/klinecharts/KLineChart/tree/main/src/extension/figure](https://github.com/klinecharts/KLineChart/tree/main/src/extension/figure) .

### Example: Custom diamond figure
```javascript
import { registerFigure } from 'klinecharts'

registerFigure({
  name: 'diamond',
  draw: (ctx, attrs, styles) => {
    const { x, y, width, height } = attrs
    const { color = '#1677ff' } = styles
    ctx.beginPath()
    ctx.moveTo(x, y - height / 2)
    ctx.lineTo(x + width / 2, y)
    ctx.lineTo(x, y + height / 2)
    ctx.lineTo(x - width / 2, y)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  },
  checkEventOn: (coordinate, attrs) => {
    const { x, y } = coordinate
    const { width, height } = attrs
    return (
      x >= attrs.x - width / 2 &&
      x <= attrs.x + width / 2 &&
      y >= attrs.y - height / 2 &&
      y <= attrs.y + height / 2
    )
  }
})
```

After registration, you can use `type: 'diamond'` in custom indicator `figures[].type` or overlay `createPointFigures` just like built-in figures.
