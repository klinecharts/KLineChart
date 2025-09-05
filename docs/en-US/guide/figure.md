<script setup>
import Tip from '../../@components/Tip.vue'
</script>

# Figure
Figure are an important part of the chart. All elements on the chart are composed of figures. If you need to make complex custom technical indicators and overlays, it is recommended to read carefully. This document describes the built-in figures and how to customize a figure. The basic figure can be obtained through the chart method `klinecharts.getFigureClass(name)`.

## Example of use
<Tip type="warn" title="Note" tip="It needs to be used when there is a canvas context."/>

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

## Customize figure
To create a custom figure, you only need to generate the basic figure information, and then add it globally through the chart API [registerFigure(figure)](/en-US/api/chart/registerFigure) , and add it to the chart to use it like a built-in basic figure. For more examples, refer to the files under [https://github.com/klinecharts/KLineChart/tree/main/src/extension/figure](https://github.com/klinecharts/KLineChart/tree/main/src/extension/figure) .
