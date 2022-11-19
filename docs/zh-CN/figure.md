# 基础图形

## 默认基础图形

### 圆弧 `arc`
#### 属性
| **属性** | **描述** |
| :---: | :---: |
| x | x轴坐标值 |
| y | y轴坐标值 |
| r | 半径 |
| startAngle | 开始角度 |
| endAngle | 结束角度 |

#### 样式
| **样式** | **描述** |
| :---: | :---: |
| style | 可选项`solid`，`dashed` |
| color | 颜色 |
| size | 尺寸 |
| dashedValue | 虚线值，`style`为`dashed`时生效 |

### 圆 `circle`
#### 属性
| **属性** | **描述** |
| :---: | :---: |
| x | x轴坐标值 |
| y | y轴坐标值 |
| r | 半径 |

#### 样式
| **样式** | **描述** |
| :---: | :---: |
| style | 可选项`fill`，`stroke`，`stroke_fill` |
| color | 颜色，类型可以是`string`，`CanvasGradient` |
| borderStyle | 边框样式，可选项`solid`，`dashed` |
| borderColor | 边框颜色 |
| borderSize | 边框尺寸 |
| borderDashedValue | 边框虚线值 |

### 线 `line`
#### 属性
| **属性** | **描述** |
| :---: | :---: |
| coordinates | 点坐标数组 |

#### 样式
| **样式** | **描述** |
| :---: | :---: |
| style | 可选项`solid`，`dashed` |
| color | 颜色 |
| size | 尺寸 |
| dashedValue | 虚线值 |

### `polygon` 多边形
#### 属性
| **属性** | **描述** |
| :---: | :---: |
| coordinates | 点坐标数组 |

#### 样式
| **样式** | **描述** |
| :---: | :---: |
| style | 可选项`fill`，`stroke`，`stroke_fill` |
| color | 颜色，类型可以是`string`，`CanvasGradient` |
| borderStyle | 边框样式，可选项`solid`，`dashed` |
| borderColor | 边框颜色 |
| borderSize | 边框尺寸 |
| borderDashedValue | 边框虚线值 |


### 矩形 `rect`
#### 属性
| **属性** | **描述** |
| :---: | :---: |
| x | 起始点x轴坐标值 |
| y | 起始点y轴坐标值 |
| width | 宽度 |
| height | 高度 |

#### 样式
| **样式** | **描述** |
| :---: | :---: |
| style | 可选项`fill`，`stroke`，`stroke_fill` |
| color | 颜色，类型可以是`string`，`CanvasGradient` |
| borderStyle | 边框样式，可选项`solid`，`dashed` |
| borderColor | 边框颜色 |
| borderSize | 边框尺寸 |
| borderDashedValue | 边框虚线值 |
| borderRadius | 边框圆角值 |


### 有边框和背景的文字 `rectText`
#### 属性
| **属性** | **描述** |
| :---: | :---: |
| x | 起始点x轴坐标值 |
| y | 起始点y轴坐标值 |
| text | 文字内容 |
| align | 对齐方式，可以选项同`CanvasTextAlign` |
| baseline | 基准，可以选项同`CanvasTextBaseline` |

#### 样式
| **样式** | **描述** |
| :---: | :---: |
| style | 可选项`fill`，`stroke`，`stroke_fill` |
| color | 颜色 |
| size | 尺寸 |
| family | 文字字体 |
| weight | 文字粗细 |
| paddingLeft | 左内边距 |
| paddingRight | 右内边距 |
| paddingTop | 上内边距 |
| paddingBootom | 下内边距 |
| borderStyle | 边框样式，可选项`solid`，`dashed` |
| borderColor | 边框颜色 |
| borderSize | 边框尺寸 |
| borderDashedValue | 边框虚线值 |
| borderRadius | 边框圆角值 |
| backgroundColor | 背景色，类型可以是`string`，`CanvasGradient` |


### 文字 `text`
#### 属性
| **属性** | **描述** |
| :---: | :---: |
| x | 起始点x轴坐标值 |
| y | 起始点y轴坐标值 |
| text | 文字内容 |
| align | 对齐方式，可以选项同`CanvasTextAlign` |
| baseline | 基准，可以选项同`CanvasTextBaseline` |

#### 样式
| **样式** | **描述** |
| :---: | :---: |
| color | 颜色 |
| size | 尺寸 |
| family | 文字字体 |
| weight | 文字粗细 |


## 基础图形模版
想要完成一个自定义的基础图形，只需要生成基础图形信息，然后通过`registerFigure`全局添加，添加到图表即可和内置基础图形一样去使用。

### 模版属性描述
```javascript
{
  // 图形名字，必要字段，是创建的唯一标识
  name: 'xxx',

  // 校验事件是否在图形上，返回一个boolean值
  // coordinate 事件的坐标
  // attrs 图形的属性
  // styles 图形样式
  checkEventOn: (coordinate, attrs, styles) => { return false },

  // 绘制
  // ctx canvas上下文
  // attrs 图形的属性
  // styles 图形样式
  draw: (ctx, attrs, styles) => {}
}
```

## 实例
以一个可以有边框和背景菱形来具体说明自定义。

### 步骤一
先确定属性和样式
属性`{ x, y, width, height }`，`x`是中心点x轴坐标值，`y`是中心点y轴坐标值，`width`是宽度，`height`是高度。
样式`{ style, color, borderStyle, borderSize, borderColor, dashedValue }`，`style`是样式类型，我们可以定义三个选项`stroke`，`fill`，`stroke_fill`，`stroke`只有边框，`fill`只有背景，`stroke_fill`又有边框又有背景，`color`是颜色，`borderStyle`是边框样式，可以定义两个选项`solid`和`dashed`，`solid`是实线，`dashed`是虚线，`borderSize`是边框尺寸，`borderColor`是边框颜色，`dashedValue`是虚线值。

### 步骤二
确定模版
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
    // 绘制填充的菱形
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
    // 绘制边框的菱形
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
