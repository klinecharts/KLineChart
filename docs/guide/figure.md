<script setup>
import Tip from '../@components/Tip.vue'
</script>

# 基础图形
基础图形（Figure）是图表渲染的最小单元。指标、覆盖物以及部分交互元素，最终都会落到图形绘制上。如果你要做自定义指标或自定义覆盖物，建议先掌握本章内容。

图形类可以通过 `klinecharts.getFigureClass(name)` 获取。

## 使用示例
<Tip type="warn" title="注意" :tip="['需要在有画布上下文的情况下使用。']"/>


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

## 通用约定
- 内置图形通常同时支持“单个对象”和“对象数组”两种 `attrs` 形式，便于批量绘制。
- 图形命中检测由 `checkEventOn` 决定，不同图形命中规则不同（例如 `line` 更偏向线段距离判断，`polygon` 更偏向区域判断）。
- 样式对象 `styles` 允许只传部分字段，未传字段会使用图形内部默认值。

## 内置基础图形
图表内置了这些基础图形：`arc`、`circle`、`line`、`polygon`、`rect`、`text`、`path`。

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
    // 平滑曲线，true 表示默认平滑；number 范围建议 0 ~ 1
    smooth?: boolean | number
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
    text: string
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

### path
```typescript
new ({
  attrs: {
    // path 左上角偏移 x（应用到绝对命令坐标）
    x: number
    // path 左上角偏移 y（应用到绝对命令坐标）
    y: number
    // 命中区域宽度（用于事件检测）
    width: number
    // 命中区域高度（用于事件检测）
    height: number
    // SVG path 字符串，支持 M/L/H/V/C/S/Q/T/A/Z 及小写相对命令
    path: string
  },
  styles: {
    // 样式，可选项 `stroke`、`fill`
    style?: 'stroke' | 'fill'
    // 颜色
    color?: string
    // 线宽（style=stroke 时生效）
    lineWidth?: number
  }
}) => Figure
```

## 自定义基础图形
创建一个自定义基础图形，只需要生成基础图形信息，然后通过图表API [registerFigure(figure)](/api/chart/registerFigure) 全局添加，添加到图表即可和内置基础图形一样去使用。更多示例可参考 [https://github.com/klinecharts/KLineChart/tree/main/src/extension/figure](https://github.com/klinecharts/KLineChart/tree/main/src/extension/figure) 下的文件。

### 示例：自定义菱形图形
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
    // 简单矩形命中（你也可以改成更精确的菱形命中）
    return (
      x >= attrs.x - width / 2 &&
      x <= attrs.x + width / 2 &&
      y >= attrs.y - height / 2 &&
      y <= attrs.y + height / 2
    )
  }
})
```

注册后即可在自定义指标的 `figures[].type` 或覆盖物的 `createPointFigures` 等返回值里，像内置图形一样使用 `type: 'diamond'`。
