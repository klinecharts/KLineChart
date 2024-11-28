---
outline: deep
---

# utils
`utils` 工具类方法集合。

## 方法列表 {#list}
### utils.clone(target)
```typescript
(target: unknown) => unknown
```
深度复制。

### utils.merge(target, source)
```typescript
(target: object, source: object) => void
```
将一个对象合并到另一个对象。

### utils.isString(value)
```typescript
(value: unknown) => boolean
```
检查某个值是否是字符串。

### utils.isNumber(value)
```typescript
(value: unknown) => boolean
```
检查某个值是否是数字。

### utils.isValid(value)
```typescript
(value: unknown) => boolean
```
检查某个值是否有效。

### utils.isObject(value)
```typescript
(value: unknown) => boolean
```
检查某个值是否是对象。

### utils.isFunction(value)
```typescript
(value: unknown) => boolean
```
检查某个值是否是方法。

### utils.isBoolean(value)
```typescript
(value: unknown) => boolean
```
检查某个值是否是bool值。

### utils.formatValue(value, key, defaultValue)
```typescript
(data: unknown, key: string, defaultValue?: unknown) => unknown
```
从某个值取对应的值，支持嵌套，如`const o = { a: { b: { c: 1 } } }`，`formatValue(o, 'a.b.c')`取`c`的值。

### utils.formatPrecision(value)
```typescript
(value: string | number, precision?: number) => string
```
格式化精度。

### utils.formatBigNumber(value)
```typescript
(value: string | number) => string
```
格式化大的数字，如1000转换成1k，1000000转换为1M等。

### utils.formatDate(dateTimeFormat, timestamp, format)
```typescript
(dateTimeFormat: Intl.DateTimeFormat, timestamp: number, format: string) => string
```
格式化日期。`format`格式，如'YYYY-MM-DD HH:mm:ss'。

### utils.formatThousands(value, sign)
```typescript
(value: string | number, sign: string) => string
```
格式化千分符。

### utils.formatFoldDecimal(value, threshold)
```typescript
(value: string | number, threshold: number) => string
```
格式化折叠小数。


### utils.calcTextWidth(text, size, weight, family)
```typescript
(text: string, size?: number, weight?: string | number, family?: string) => number
```
计算文字宽度

### utils.getLinearSlopeIntercept(coordinate1, coordinate2)
```typescript
(
  coordinate1: {
    x: number
    y: number
  },
  coordinate2: {
    x: number
    y: number
  }
) => []
```
根据两个坐标点，获取点组成的线的斜率和常数项，即`y = kx + b`中的`k`和`b`。

### utils.getLinearYFromCoordinates(coordinate1, coordinate2, targetCoordinate)
```typescript
(
  coordinate1: {
    x: number
    y: number
  },
  coordinate2: {
    x: number
    y: number
  }
  targetCoordinate: {
    x: number
    y: number
  }
) => number
```
获取一个点在另外两个坐标点形成的线上的y轴坐标值。

### utils.getLinearYFromSlopeIntercept(kb, targetCoordinate)
```typescript
(
  kb: Array<number>,
  targetCoordinate: {
    x: number
    y: number
  }
) => number
```
获取一个点在斜率和常数项形成的线上的y轴坐标值。

### utils.checkCoordinateOnArc(coordinate, arc)
```typescript
(
  coordinate: {
    x: number
    y: number
  },
  arc: {
    x: number
    y: number
    r: number
    startAngle: number
    endAngle: number
  }
) => boolean
```
检查某个坐标点是否在圆弧上。
- `coordinate` 坐标点信息
- `arc` 圆弧参数
  - `x` 圆心的x轴值
  - `y` 圆心的y轴值
  - `r` 半径
  - `startAngle` 起始角度
  - `endAngle` 结束角度

### utils.checkCoordinateOnCircle(coordinate, circle)
```typescript
(
  coordinate: {
    x: number
    y: number
  },
  circle: {
    x: number
    y: number
    r: number
  }
) => boolean
```
检查某个坐标点是否在圆上。
- `coordinate` 坐标点信息
- `circle` 圆参数
  - `x` 圆心的x轴值
  - `y` 圆心的y轴值
  - `r` 半径

### utils.checkCoordinateOnLine(coordinate, line)
```typescript
(
  coordinate: {
    x: number
    y: number
  },
  line: {
    coordinates: Array<{
      x: number
      y: number
    }>
  }
) => boolean
```
检查某个坐标点是否在线上。

### utils.checkCoordinateOnPolygon(coordinate, polygon)
```typescript
(
  coordinate: {
    x: number
    y: number
  },
  polygon: {
    coordinates: Array<{
      x: number
      y: number
    }>
  }
) => boolean
```
检查某个坐标点是否在多边形上。

### utils.checkCoordinateOnRect(coordinate, rect)
```typescript
(
  coordinate: {
    x: number
    y: number
  },
  rect: {
    x: number
    y: number
    width: number
    height: number
  }
) => boolean
```
检查某个坐标点是否在矩形上。
- `coordinate` 坐标点信息
- `rect` 矩形参数
  - `x` 起始点x轴值
  - `y` 起始点y轴值
  - `width` 宽度
  - `height` 高度

### utils.checkCoordinateOnText(coordinate, text, styles)
```typescript
(
  coordinate: {
    x: number
    y: number
  },
  text: {
    x: number
    y: number
    text: unknown
    align?: 'center' | 'end' | 'left' | 'right' | 'start'
    baseline?: 'alphabetic' | 'bottom' | 'hanging' | 'ideographic' | 'middle' | 'top'
  },
  styles: {
    color?: string
    size?: number
    family?: string
    weight?: number | string
  }
) => boolean
```
检查某个坐标点是否在文字上。
- `coordinate` 坐标点信息
- `text` 文字参数
  - `x` 起始点x轴值
  - `y` 起始点y轴值
  - `text` 文字内容
  - `align` 水平对齐方式
  - `baseline` 垂直对齐方式
- `styles` 样式
  - `color` 颜色
  - `size` 尺寸
  - `family` 字体
  - `weight` 权重
