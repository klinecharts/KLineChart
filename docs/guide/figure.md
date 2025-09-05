<script setup>
import Tip from '../@components/Tip.vue'
</script>

# 基础图形
基础图形是图表重要的组成部分，图表上所有的元素都是由基础图形组成，如果需要制作复杂的自定义技术指标和覆盖物，建议仔细阅读。这篇文档介绍了内置的基本图形和如何自定义一个基础图形。基础图形可以通过图表方法    `klinecharts.getFigureClass(name)` 获取。

## 使用示例
<Tip type="warn" title="注意" tip="需要在有画布上下文的情况下使用。"/>


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
图表内置了这些基础图形，`arc` ， `circle` ， `line` ， `polygon` ， `rect` ， `text` 。
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

## 自定义基础图形
创建一个自定义基础图形，只需要生成基础图形信息，然后通过图表API [registerFigure(figure)](/api/chart/registerFigure) 全局添加，添加到图表即可和内置基础图形一样去使用。更多示例可参考 [https://github.com/klinecharts/KLineChart/tree/main/src/extension/figure](https://github.com/klinecharts/KLineChart/tree/main/src/extension/figure) 下的文件。

