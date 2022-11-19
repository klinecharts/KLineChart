# Figure

## Default figure

### arc
#### Attribute
| **attribute** | **description** |
| :---: | :---: |
| x | x-axis coordinate value |
| y | y-axis coordinate value |
| r | radius |
| startAngle | start angle |
| endAngle | end angle |

#### Style
| **style** | **description** |
| :---: | :---: |
| style | options is `solid` and `dashed` |
| color | color |
| size | size |
| dashedValue | effective when `style` is `dashed` |

### circle
#### Attribute
| **attribute** | **description** |
| :---: | :---: |
| x | x-axis coordinate value |
| y | y-axis coordinate value |
| r | radius |

#### Style
| **style** | **description** |
| :---: | :---: |
| style | options is `fill`, `stroke` and `stroke_fill` |
| color | color, type is `string` or `CanvasGradient` |
| borderStyle | options is `solid` and `dashed` |
| borderColor | border color |
| borderSize | border size |
| borderDashedValue | effective when `borderStyle` is `dashed` |

### line
#### Attribute
| **attribute** | **description** |
| :---: | :---: |
| coordinates | coordinate array |

#### Style
| **style** | **description** |
| :---: | :---: |
| style | options is `solid` and `dashed` |
| color | color |
| size | size |
| dashedValue | effective when `style` is `dashed` |

### polygon
#### Attribute
| **attribute** | **description** |
| :---: | :---: |
| coordinates | coordinate array |

#### Style
| **style** | **description** |
| :---: | :---: |
| style | options is `fill`, `stroke` and `stroke_fill` |
| color | color, type is `string` or `CanvasGradient` |
| borderStyle | options is `solid` and `dashed` |
| borderColor | border color |
| borderSize | border size |
| borderDashedValue | effective when `borderStyle` is `dashed` |


### rect
#### Attribute
| **attribute** | **description** |
| :---: | :---: |
| x | x-axis coordinate value |
| y | y-axis coordinate value |
| width | width |
| height | height |

#### Style
| **style** | **description** |
| :---: | :---: |
| style | options is `fill`, `stroke` and `stroke_fill` |
| color | color, type is `string` or `CanvasGradient` |
| borderStyle | options is `solid` and `dashed` |
| borderColor | border color |
| borderSize | border size |
| borderDashedValue | effective when `borderStyle` is `dashed` |
| borderRadius | border radius |


### rectText
#### Attribute
| **attribute** | **description** |
| :---: | :---: |
| x | x-axis coordinate value |
| y | y-axis coordinate value |
| text | text |
| align | the type is the same as `CanvasTextAlign` |
| baseline | the type is the same as `CanvasTextBaseline` |

#### Style
| **attribute** | **description** |
| :---: | :---: |
| style | options is `fill`, `stroke` and `stroke_fill` |
| color | text color |
| size | text size |
| family | text family |
| weight | text weight |
| paddingLeft | padding left |
| paddingRight | padding right |
| paddingTop | padding top |
| paddingBootom | padding bottom |
| borderStyle | options is `solid` and `dashed` |
| borderColor | border color |
| borderSize | border size |
| borderDashedValue | effective when `borderStyle` is `dashed` |
| borderRadius | borde radius |
| backgroundColor | background，type is `string` or `CanvasGradient` |


### text
#### Attribute
| **attribute** | **description** |
| :---: | :---: |
| x | x-axis coordinate value |
| y | y-axis coordinate value |
| text | text |
| align | the type is the same as `CanvasTextAlign` |
| baseline | the type is the same as `CanvasTextBaseline` |

#### Style
| **attribute** | **description** |
| :---: | :---: |
| color | text color |
| size | text size |
| family | text family |
| weight | text weight |


## Figure template
To complete a user-defined figure, you only need to generate the figure information, and then add it globally through 'registerFigure'. Adding it to a graph can be used as a built-in figure.

### Template attribute description
```javascript
{
  // name, a required field, is the only identifier created
  name: 'xxx',

  // Verify whether the event is on the figure and return a boolean value
  // coordinate Event coordinate
  // attrs Figure attribute
  // styles Figure style
  checkEventOn: (coordinate, attrs, styles) => { return false },

  // draw
  // ctx Canvas context
  // attrs Figure attribute
  // styles Figure style
  draw: (ctx, attrs, styles) => {}
}
```

## Example
A diamond with border and background can be used to specify customization.

### Step 1
Determine attributes and styles first
Attribute `{ x, y, width, height }`, `x` is the x-axis coordinate value of the center point, `y` is the y-axis coordinate value of the center point, `width` is the width, and `height` is the height.

Style `{ style, color, borderStyle, borderSize, borderColor, dashedValue }`, `style` is a style type, we can define three options `stroke`, `fill`, `stroke_fill`, `stroke` only the border, `fill` only the background, `stroke_fill` has both a border and a background. `color` is a color, `borderStyle` is a border style. we can define two options `solid` and `dashed`. `solid` is a solid line, `dashed` is a dotted line, `borderSize` is a border size, `borderColor` is a border color, and `dashedValue` is a dotted line value.

### Step 2
Determine template
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
      style = PolygonType.FILL,
      color = 'currentColor',
      borderSize = 1,
      borderColor = 'currentColor',
      borderStyle = 'solid,
      borderDashedValue = [2, 2]
    } = styles
    // Draw filled diamond
    if (style === 'fill' || styles.style === 'stroke_fill') {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x - width / 2, y)
      ctx.lineTo(x, y - height / 2)
      ctx.lineTo(x + width / 2, y)
      ctx.lineTo(x, y + height / 2)
      ctx.closePath()
      ctx.fill()
    }
    // Draw border diamond
    if (style === 'stroke' || styles.style === 'stroke_fill') {
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderSize
      if (borderStyle === LineType.DASHED) {
        ctx.setLineDash(borderDashedValue)
      } else {
        ctx.setLineDash([])
      }
      ctx.beginPath()
      ctx.beginPath()
      ctx.moveTo(x - width / 2, y)
      ctx.lineTo(x, y - height / 2)
      ctx.lineTo(x + width / 2, y)
      ctx.lineTo(x, y + height / 2)
      ctx.closePath()
      ctx.stroke()
    }
  }
}
```
