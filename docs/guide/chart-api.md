# 图表API

## init(ds, options)
```typescript
(
  ds: string | HTMLElement,
  options?: {
    layout?: Array<{
      type: 'candle' | 'indicator' | 'xAxis'
      content: Array<Indicator | string>
      options: {
        id?: string
        height?: number
        minHeight?: number
        dragEnabled?: boolean
        position?: 'top' | 'bottom'
        gap?: {
          top?: number
          bottom?: number
        }
        axisOptions?: {
          name?: string
          scrollZoomEnabled?: boolean
        }
      }
    }>
    locale?: string
    styles?: string | object
    timezone?: string
    customApi?: {
      formatDate?: (dateTimeFormat: Intl.DateTimeFormat, timestamp: number, format: string, type: number) => string
      formatBigNumber?: (value: string | number) => string
    }
    thousandsSeparator?: string
    decimalFoldThreshold?: number
  }
) => Chart
```
初始化一个图表，返回图表实例。
- `ds` 容器，可以是dom元素或者元素id。
- `options` 可选配置项。
  - `layout` 自定义布局，`content`中的内容和`options`参考实例方法 [createIndicator](./instance-api#createindicator-value-isstack-paneoptions-callback) 中的入参`value`和`options`。 <Badge>^9.6.0</Badge>
  - `locale` 语言，内置支持`zh-CN`和`en-US`。
  - `timezone` 时区名，如'Asia/Shanghai'，如果不设置会自动获取本机时区，时区对应名字列表请参阅[时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)。
  - `styles` 可以是通过`klinecharts.registerStyles`注册的样式名，也可以是object，样式列表，详情参阅[样式](./styles.md)，支持增量。
  - `customApi` 自定义一些api。
    - `formatDate` 格式化日期。
    - `formatBigNumber` 格式化大的数字，如1000转换成1k，1000000转换为1M等。
  - `thousandsSeparator` 千分符
  - `decimalFoldThreshold` 小数折叠阈值 <Badge>^9.8.0</Badge>


## dispose(dcs)
```typescript
(dcs: HTMLElement | Chart | string) => void
```
销毁一个图表，一旦销毁，图表将不再可用。
- `dcs` 可以是dom元素、元素id或者图表实例。


## registerLocale(locale, locales)
```typescript
(
  locale: string,
  locales: {
    time: string
    open: string
    high: string
    low: string
    close: string
    volume: string
  }
) => void
```
添加一个本地化语言。图表内置了`zh-CN`和`en-US`。
- `locale` 语言名
- `locales` 语言配置

## getOverlayClass()
```typescript
(name: string) => Nullable<OverlayConstructor>
```
根据覆盖物名称获取图表内覆盖物的属性。

## getSupportedLocales()
```typescript
() => string[]
```
获取图表支持的本地化语言类型。

## registerStyles(name, styles)
```typescript
(
  name: string,
  styles: object
) => void
```
添加一个样式配置。
- `name` 样式名
- `styles` 样式配置，类型参阅[样式](./styles.md)，支持增量。


## registerFigure(figure)
```typescript
(
  figure: {
    name: string
    draw: (ctx: CanvasRenderingContext2D, attrs: any, styles: object) => void
    checkEventOn: (coordinate: Coordinate, attrs: any, styles: object) => boolean
  }
) => void
```
添加一个基础图形。
- `figure` 基础图形信息，详情参阅[基础图形](./figure.md)
  - `name` 名字，唯一标识
  - `draw` 绘制方法
  - `checkEventOn` 检查事件是否在图形上

## getSupportedFigures()
```typescript
() => string[]
```
获取图表支持的基础图形类型。


## getFigureClass(name)
```typescript
(name: string) => Figure
```
获取图形类
- `name` 图形名


## registerIndicator(indicator)
```typescript
(
  indicator: {
    name: string
    shortName?: string
    precision?: number
    calcParams?: any[]
    shouldOhlc?: boolean
    shouldFormatBigNumber?: boolean
    visible?: boolean
    extendData?: any
    series?: 'normal' | 'price' | 'volume'
    figures?: Array<{
      key: string
      title?: string
      type?: string
      baseValue?: number
      attrs?: ({
        data: object
        coordinate: object
        bounding: object
        barSpace: object
        xAxis: object
        yAxis: object
      }) => object
      styles?: (
        data: object,
        indicator: object,
        defaultStyles: object
      ) => object
    }>
    minValue?: number
    maxValue?: number
    styles?: object
    calc: (dataList: KLineData[], indicator: object) => Promise<object[]> | object[]
    regenerateFigures?: (calcParms: any[]) => Array<{
      key: string
      title?: string
      type?: string
      baseValue?: number
      styles?: (
        data: object,
        indicator: object,
        defaultStyles: object
      ) => object
      attrs: (
        coordinate: object
        bounding: Bounding
        barSpace: BarSpace
        xAxis: XAxis
        yAxis: YAxis
      ) => object
    }>
    createTooltipDataSource?: (params: object) => {
      name?: string
      calcParamsText?: string
      values?: Array<{
        title: string | {
          text: string
          color: string
        }
        value: string | {
          text: string
          color: string
        }
      }>
    }
    draw?: (params: object) => boolean
  }
) => void
```
添加一个技术指标。
- `indicator` 技术指标信息
  - `name` 指标名，用于创建和操作的唯一标识
  - `shortName` 简短名字，用于显示
  - `precision` 精度
  - `calcParams` 计算参数
  - `shouldOhlc` 是否需要ohlc辅助图形
  - `shouldFormatBigNumber` 是否需要格式化大的数字。如1000转换成1k，1000000转换为1M等
  - `visible` 是否可见
  - `extendData` 扩展数据
  - `series` 指标系列，可选项有'normal'，'price'和'volume'
  - `figures` 图形配置
  - `minValue` 指定最小值
  - `maxValue` 指定最大值
  - `styles` 样式
  - `calc` 计算方法
  - `regenerateFigures` 重新生成图形信息方法
  - `createTooltipDataSource` 创建自定义提示信息方法
  - `draw` 自定义绘制方法


## getSupportedIndicators()
```typescript
() => string[]
```
获取图表支持的技术指标

## registerOverlay(overlay)
```typescript
(
  overlay: {
    name: string
    totalStep?: number
    lock?: boolean
    visible?: boolean
    zLevel?: number
    needDefaultPointFigure?: boolean
    needDefaultXAxisFigure?: boolean
    needDefaultYAxisFigure?: boolean
    mode?: 'normal' | 'weak_magnet' | 'strong_magnet'
    modeSensitivity?: number
    points?: Array<{ timestamp: number, dataIndex?: number, value?: number }>
    extendData?: any
    styles?: object
    createPointFigures?: (params: object) => {
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
    } | Array<{
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
    }>
    createXAxisFigures?: (params: object) => {
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
    } | Array<{
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
    }>
    createYAxisFigures?: (params: object) => {
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
    } | Array<{
      key?: string
      type: string
      attrs: any | any[]
      styles?: any
      ignoreEvent?: boolean | OverlayFigureIgnoreEventType[]
    }>
    performEventPressedMove?: (params: object) => void
    performEventMoveForDrawing?: (params: object) => void
    onDrawStart?: (event: object) => boolean
    onDrawing?: (event: object) => boolean
    onDrawEnd?: (event: object) => boolean
    onClick?: (event: object) => boolean
    onDoubleClick?: (event: object) => boolean
    onRightClick?: (event: object) => boolean
    onPressedMoveStart?: (event: object) => boolean
    onPressedMoving?: (event: object) => boolean
    onPressedMoveEnd?: (event: object) => boolean
    onMouseEnter?: (event: object) => boolean
    onMouseLeave?: (event: object) => boolean
    onRemoved?: (event: object) => boolean
    onSelected?: (event: object) => boolean
    onDeselected?: (event: object) => boolean
  }
) => void
```
添加一个覆盖物。
- `overlay` 覆盖物信息，详情参阅[覆盖物](./overlay.md)
  - `name` 覆盖物名，用于创建的唯一标识
  - `totalStep` 总的实现步骤
  - `lock` 是否锁定不让拖动
  - `visible` 是否可见
  - `zLevel` 绘制层级，值越大，越靠前显示
  - `needDefaultPointFigure` 是否需要默认的点对应的图形
  - `needDefaultXAxisFigure` 是否需要默认的x轴上的图形
  - `needDefaultYAxisFigure` 是否需要默认的y轴上的图形
  - `mode` 模式，可选项有'normal'，'weak_magnet'和'strong_magnet'
  - `modeSensitivity` 模式灵敏度，仅 mode 是 weak_magnet 时有效 <Badge>^9.5.0</Badge>
  - `points` 点信息
  - `extendData` 扩展数据
  - `styles` 样式
  - `createPointFigures` 创建点对应的图形
  - `createXAxisFigures` 创建x轴上的图形
  - `createYAxisFigures` 创建y轴上的图形
  - `performEventPressedMove` 按住移动事件特殊处理方法
  - `performEventMoveForDrawing` 移动事件过程中特殊处理方法
  - `onDrawStart` 开始绘制事件
  - `onDrawing` 绘制中事件
  - `onDrawEnd` 绘制结束事件
  - `onClick` 点击事件
  - `onDoubleClick` 双击事件 <Badge>^9.5.0</Badge>
  - `onRightClick` 右击事件
  - `onPressedMoveStart` 按住开始移动事件
  - `onPressedMoving` 按住移动中事件
  - `onPressedMoveEnd` 按住移动结束事件
  - `onMouseEnter` 鼠标移入事件
  - `onMouseLeave` 鼠标移出事件
  - `onRemoved` 删除事件
  - `onSelected` 选中事件
  - `onDeselected` 取消选中事件

## getSupportedOverlays()
```typescript
() => string[]
```
获取图表支持的覆盖物

## registerXAxis(axis) <Badge>^9.8.0</Badge>
```typescript
(
  axis: {
    name: string
    createTicks: (params: object) => Array<{
      coord: number
      value: number | string
      text: string
    }>
  }
) => void
```
添加一个自定义x轴。
- `axis` 坐标信息
  - `name` 坐标轴名字
  - `createTicks` 创建分割文字

## registerYAxis(axis) <Badge>^9.8.0</Badge>
```typescript
(
  axis: {
    name: string
    createTicks: (params: object) => Array<{
      coord: number
      value: number | string
      text: string
    }>
  }
) => void
```
添加一个自定义y轴。
- `axis` 坐标信息
  - `name` 坐标轴名字
  - `createTicks` 创建分割文字

## version()
```typescript
() => string
```
获取图表当前版本号。

## utils
辅助方法集合。
### utils.clone(target)
```typescript
(target: any) => any
```
深度复制。

### utils.merge(target, source)
```typescript
(target: object, source: object) => void
```
将一个对象合并到另一个对象。

### utils.isString(value)
```typescript
(value: any) => boolean
```
检查某个值是否是字符串。

### utils.isNumber(value)
```typescript
(value: any) => boolean
```
检查某个值是否是数字。

### utils.isValid(value)
```typescript
(value: any) => boolean
```
检查某个值是否有效。

### utils.isObject(value)
```typescript
(value: any) => boolean
```
检查某个值是否是对象。

### utils.isFunction(value)
```typescript
(value: any) => boolean
```
检查某个值是否是方法。

### utils.isBoolean(value)
```typescript
(value: any) => boolean
```
检查某个值是否是bool值。

### utils.formatValue(value, key, defaultValue)
```typescript
(data: any, key: string, defaultValue?: any) => any
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
格式化日期千分符。

### utils.formatFoldDecimal(value, threshold) <Badge>^9.8.0</Badge>
```typescript
(value: string | number, threshold: number) => string
```
格式化折叠小数。


### utils.calcTextWidth(text, size, weight, family) <Badge>^9.3.0</Badge>
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
    text: any
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


### utils.drawArc(ctx, arc, styles)
```typescript
(
  ctx: CanvasRenderingContext2D,
  arc: {
    x: number
    y: number
    r: number
    startAngle: number
    endAngle: number
  },
  styles: {
    style?: 'solid' | 'dashed'
    size?: number
    color?: string
    dashedValue?: number[]
  }
) => void
```
绘制圆弧。
- `ctx` 画布上下文
- `arc` 圆弧参数
  - `x` 圆心的x轴值
  - `y` 圆心的y轴值
  - `r` 半径
  - `startAngle` 起始角度
  - `endAngle` 结束角度
- `styles` 样式
  - `style` 弧样式
  - `size` 粗细
  - `color` 颜色
  - `dashedValue` 虚线参数值

### utils.drawCircle(ctx, circle, styles)
```typescript
(
  ctx: CanvasRenderingContext2D,
  circle: {
    x: number
    y: number
    r: number
  },
  styles: {
    style?: 'stroke' | 'fill' | 'stroke_fill'
    color?: string | CanvasGradient
    borderColor?: string
    borderSize?: number
    borderStyle?: 'solid' | 'dashed'
    borderDashedValue?: Array<number>
  }
) => void
```
绘制圆。
- `ctx` 画布上下文
- `circle` 圆参数
  - `x` 圆心的x轴值
  - `y` 圆心的y轴值
  - `r` 半径
- `styles` 样式
  - `style` 样式
  - `color` 颜色
  - `borderColor` 边框颜色
  - `borderSize` 边框粗细
  - `borderStyle` 边框样式
  - `borderDashedValue` 边框虚线参数值

### utils.drawLine(ctx, line, styles)
```typescript
(
  ctx: CanvasRenderingContext2D,
  line: {
    coordinates: Array<{
      x: number
      y: number
    }>
  },
  styles: {
    style?: 'solid' | 'dashed'
    size?: number
    color?: string
    dashedValue?: number[]
  }
) => void
```
绘制线。
- `ctx` 画布上下文
- `line` 线参数
- `styles` 样式
  - `style` 线样式
  - `size` 粗细
  - `color` 颜色
  - `dashedValue` 虚线参数值

### utils.drawPolygon(ctx, polygon, styles)
```typescript
(
  ctx: CanvasRenderingContext2D,
  polygon: {
    coordinates: Array<{
      x: number
      y: number
    }>
  },
  styles: {
    style?: 'stroke' | 'fill' | 'stroke_fill'
    color?: string | CanvasGradient
    borderColor?: string
    borderSize?: number
    borderStyle?: 'solid' | 'dashed'
    borderDashedValue?: Array<number>
  }
) => void
```
绘制多边形。
- `ctx` 画布上下文
- `polygon` 多边形参数
- `styles` 样式
  - `style` 样式
  - `color` 颜色
  - `borderColor` 边框颜色
  - `borderSize` 边框粗细
  - `borderStyle` 边框样式
  - `borderDashedValue` 边框虚线参数值

### utils.drawRect(ctx, rect, styles)
```typescript
(
  ctx: CanvasRenderingContext2D,
  rect: {
    x: number
    y: number
    width: number
    height: number
  },
  styles: {
    style?: 'stroke' | 'fill' | 'stroke_fill'
    color?: string | CanvasGradient
    borderColor?: string
    borderSize?: number
    borderStyle?: 'solid' | 'dashed'
    borderDashedValue?: Array<number>
    borderRadius?: number
  }
) => void
```
绘制矩形。
- `ctx` 画布上下文
- `rect` 矩形参数
  - `x` 起始点x轴值
  - `y` 起始点y轴值
  - `width` 宽度
  - `height` 高度
- `styles` 样式
  - `style` 样式
  - `color` 颜色
  - `borderColor` 边框颜色
  - `borderSize` 边框粗细
  - `borderStyle` 边框样式
  - `borderDashedValue` 边框虚线参数值
  - `borderRadius` 边框圆角值


### utils.drawText(ctx, text, styles)
```typescript
(
  ctx: CanvasRenderingContext2D,
  text: {
    x: number
    y: number
    text: any
    width?: number
    height?: number
    align?: 'center' | 'end' | 'left' | 'right' | 'start'
    baseline?: 'alphabetic' | 'bottom' | 'hanging' | 'ideographic' | 'middle' | 'top'
  },
  styles: {
    style?: 'stroke' | 'fill' | 'stroke_fill'
    color?: string
    size?: number
    family?: string
    weight?: number | string
    paddingLeft?: number
    paddingTop?: number
    paddingRight?: number
    paddingBottom?: number
    borderStyle?: 'solid' | 'dashed'
    borderDashedValue?: number[]
    borderSize?: number
    borderColor?: string
    borderRadius?: number
    backgroundColor?: string
  }
) => void
```
绘制带背景的文字。
- `ctx` 画布上下文
- `attrs` 文字参数
  - `x` 起始点x轴值
  - `y` 起始点y轴值
  - `text` 文字内容
  - `width` 宽度
  - `height` 高度
  - `align` 水平对齐方式
  - `baseline` 垂直对齐方式
- `styles` 样式
  - `style` 样式
  - `color` 颜色
  - `size` 尺寸
  - `family` 字体
  - `weight` 权重
  - `paddingLeft` 左内边距,
  - `paddingTop` 上内边距,
  - `paddingRight` 右内边距,
  - `paddingBottom` 下内边距,
  - `borderColor` 边框颜色
  - `borderSize` 边框粗细
  - `borderStyle` 边框样式
  - `borderRadius` 边框圆角尺寸
  - `borderDashedValue` 边框虚线参数值
  - `backgroundColor` 背景色
  
### utils.drawRectText(ctx, rectText, styles)
同`utils.drawText(ctx, text, styles)`，已废弃，v10之后会删除，请用`utils.drawText(ctx, text, styles)`代替。