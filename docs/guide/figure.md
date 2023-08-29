# 基础图形
基础图形是图表重要的组成部分，图表上所有的元素都是由基础图形组成，如果需要制作复杂的自定义技术指标和覆盖物，建议仔细阅读。这篇文档介绍了内置的基本图形和如何自定义一个基础图形。基础图形可以通过图表方法`klinecharts.getFigureClass(name)`获取。

## 使用示例
::: warning 注意
需要在有画布上下文的情况下使用。
:::

```javascript
// 获取基础图形实例
// name为基础图形名字，如，'arc', 'circle'等。
const Figure = klinecharts.getFigureClass(name)
// 实例化并绘制
// attrs 属性
// styles 样式
// ctx 画布上下文
new Figure({ attrs, styles }).draw(ctx)
```

## 内置基础图形
图表内置了这些基础图形，`arc`，`circle`，`line`，`polygon`，`rect`，`text`，`rectText`。
### arc
```typescript
new ({
  attrs: {
    // 圆心x轴坐标值
    x: number
    // 圆心y轴坐标值
    y: number
    // 半径
    r: number
    // 开始角度
    startAngle: number
    // 结束角度
    endAngle: number
  },
  styles: {
    // 样式，可选项`solid`，`dashed`
    style?: 'solid' | 'dashed'
    // 尺寸
    size?: number
    // 颜色
    color?: string
    // 虚线参数
    dashedValue?: number[]
  }
}) => Figure
```

### circle
```typescript
new ({
  attrs: {
    // 圆心x轴坐标值
    x: number
    // 圆心y轴坐标值
    y: number
    // 半径
    r: number
  },
  styles: {
    // 样式，可选项`fill`，`stroke`，`stroke_fill`
    style?: 'fill' | 'stroke' | 'stroke_fill'
    // 颜色
    color?: string
    // 边框样式
    borderStyle?: 'solid' | 'dashed'
    // 边框颜色
    borderColor?: string
    // 边框尺寸
    borderSize?: number
    // 边框虚线参数
    borderDashedValue?: number[]
  }
}) => Figure
```

### line
```typescript
new ({
  attrs: {
    // 坐标集合
    coordinates: Array<{
      x: number
      y: number
    }>
  },
  styles: {
    // 样式，可选项`solid`，`dashed`
    style?: 'solid' | 'dashed'
    // 尺寸
    size?: number
    // 颜色
    color?: string
    // 虚线参数
    dashedValue?: number[]
  }
}) => Figure
```

### polygon
```typescript
new ({
  attrs: {
    // 坐标集合
    coordinates: Array<{
      x: number
      y: number
    }>
  },
  styles: {
    // 样式，可选项`fill`，`stroke`，`stroke_fill`
    style?: 'fill' | 'stroke' | 'stroke_fill'
    // 颜色
    color?: string
    // 边框样式
    borderStyle?: 'solid' | 'dashed'
    // 边框颜色
    borderColor?: string
    // 边框尺寸
    borderSize?: number
    // 边框虚线参数
    borderDashedValue?: number[]
  }
}) => Figure
```

### rect
```typescript
new ({
  attrs: {
    // 起始点x轴坐标值
    x: number
    // 起始点y轴坐标值
    y: number
    // 宽度
    width: number
    // 高度
    height: number
  },
  styles: {
    // 样式，可选项`fill`，`stroke`，`stroke_fill`
    style?: 'fill' | 'stroke' | 'stroke_fill'
    // 颜色
    color?: string
    // 边框样式
    borderStyle?: 'solid' | 'dashed',
    // 边框颜色
    borderColor?: string
    // 边框尺寸
    borderSize?: number
    // 边框虚线参数
    borderDashedValue?: number[]
    // 边框圆角值
    borderRadius?: number
  }
}) => Figure
```

### text
```typescript
new ({
  attrs: {
    // 起始点x轴坐标值
    x: number
    // 起始点y轴坐标值
    y: number
    // 文字内容
    text: any
    // 指定宽
    width?: number
    // 指定高
    height?: number
    // 对齐方式
    align?: CanvasTextAlign
    // 基准
    baseline?: CanvasTextBaseline
  },
  styles: {
    // 样式，可选项`fill`，`stroke`，`stroke_fill`
    style?: 'fill' | 'stroke' | 'stroke_fill'
    // 颜色
    color?: string
    // 尺寸
    size?: number
    // 字体
    family?: string
    // 粗细
    weight?: string | number
    // 左内边距
    paddingLeft?: number
    // 右内边距
    paddingRight?: number
    // 上内边距
    paddingTop?: number
    // 下内边距
    paddingBottom?: number
    // 边框样式
    borderStyle?: 'solid' | 'dashed'
    // 边框颜色
    borderColor?: string
    // 边框尺寸
    borderSize?: number
    // 边框虚线参数
    borderDashedValue?: number[]
    // 边框圆角值
    borderRadius?: number
    // 背景色
    backgroundColor?: string | CanvasGradient
  }
}) => Figure
```

### rectText
同`text`，已废弃，v10之后会删除，请用`text`代替。

## 自定义基础图形
创建一个自定义基础图形，只需要生成基础图形信息，然后通过`klinecharts.registerFigure`全局添加，添加到图表即可和内置基础图形一样去使用。

### 属性说明
```typescript
{
  // 图形名字，必要字段，是创建的唯一标识
  name: string

  // 校验事件是否在图形上，返回一个boolean值
  checkEventOn: (
    // 事件的坐标
    coordinate: {
      x: number
      y: number
    }
    // 图形的属性
    attrs: any
    // 图形的样式
    styles: any
  ) => boolean

  // 绘制
  draw: (
    // 画布上下文
    ctx: CanvasRenderingContext2D,
    // 图形的属性
    attrs: any,
    // 图形的样式
  ) => void
}
```

### 示例
以一个可以有边框和背景菱形来具体说明自定义。

#### 步骤一
先确定属性和样式
属性`{ x, y, width, height }`，`x`是中心点x轴坐标值，`y`是中心点y轴坐标值，`width`是宽度，`height`是高度。
样式`{ style, color, borderStyle, borderSize, borderColor, dashedValue }`，`style`是样式类型，我们可以定义三个选项`stroke`，`fill`，`stroke_fill`，`stroke`只有边框，`fill`只有背景，`stroke_fill`又有边框又有背景，`color`是颜色，`borderStyle`是边框样式，可以定义两个选项`solid`和`dashed`，`solid`是实线，`dashed`是虚线，`borderSize`是边框尺寸，`borderColor`是边框颜色，`dashedValue`是虚线值。

#### 步骤二
实现`checkEventOn`和`draw`两个方法。
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
      borderStyle = 'solid',
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
      if (borderStyle === 'dashed') {
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
这样一个自定义的基础图形就完成了。
