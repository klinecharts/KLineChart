---
outline: deep
---

# utils
`utils` collection of tool class methods.

## Method List {#list}
### utils.clone(target)
```typescript
(target: any) => any
```
deep copy.

### utils.merge(target, source)
```typescript
(target: object, source: object) => void
```
Merge one object into another.

### utils.isString(value)
```typescript
(value: any) => boolean
```
Checks if a value is a string.

### utils.isNumber(value)
```typescript
(value: any) => boolean
```
Checks if a value is a number.

### utils.isValid(value)
```typescript
(value: any) => boolean
```
Checks if a value is valid.

### utils.isObject(value)
```typescript
(value: any) => boolean
```
Checks if a value is an object.

### utils.isFunction(value)
```typescript
(value: any) => boolean
```
Checks if a value is a method.

### utils.isBoolean(value)
```typescript
(value: any) => boolean
```
Checks if a value is a bool value.

### utils.formatValue(value, key, defaultValue)
```typescript
(data: any, key: string, defaultValue?: any) => any
```
Get the corresponding value from a certain value, support nesting, such as `const o = { a: { b: { c: 1 } } }`, `formatValue(o, 'a.b.c')` takes the value of `c` .

### utils.formatPrecision(value)
```typescript
(value: string | number, precision?: number) => string
```
Formatting precision.

### utils.formatBigNumber(value)
```typescript
(value: string | number) => string
```
Format large numbers, such as 1000 into 1k, 1000000 into 1M, etc.

### utils.formatDate(dateTimeFormat, timestamp, format)
```typescript
(dateTimeFormat: Intl.DateTimeFormat, timestamp: number, format: string) => string
```
Format date. `format`, such as 'YYYY-MM-DD HH:mm:ss'.

### utils.formatThousands(value, sign)
```typescript
(value: string | number, sign: string) => string
```
Format thousands separator.

### utils.formatFoldDecimal(value, threshold) <Badge>^9.8.0</Badge>
```typescript
(value: string | number, threshold: number) => string
```
Format fold decimal.


### utils.calcTextWidth(text, size, weight, family) <Badge>^9.3.0</Badge>
```typescript
(text: string, size?: number, weight?: string | number, family?: string) => number
```
Calculate text width.

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
According to two coordinate points, get the slope and constant term of the line composed of points, namely `k` and `b` in `y = kx + b`.

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
   },
   targetCoordinate: {
      x: number
      y: number
   }
) => number
```
Get the y-axis coordinate value of a point on the line formed by two other coordinate points.

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
Get the y-coordinate value of a point on the line formed by the slope and the constant term.

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
Check whether a certain coordinate point is on the arc.
- `coordinate` coordinate point information
- `arc` arc parameter
   - `x` the x-axis value of the center of the circle
   - `y` the y-axis value of the center of the circle
   - `r` radius
   - `startAngle` start angle
   - `endAngle` end angle

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
Checks whether a certain coordinate point is on a circle.
- `coordinate` coordinate point information
- `circle` circle parameter
   - `x` the x-axis value of the center of the circle
   - `y` the y-axis value of the center of the circle
   - `r` radius

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
Check if a certain coordinate point is on the line.

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
Checks whether a certain coordinate point is on a polygon.

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
Checks whether a certain coordinate point is on a rectangle.
- `coordinate` coordinate point information
- `rect` rectangle parameter
   - `x` starting point x-axis value
   - `y` starting point y-axis value
   - `width` width
   - `height` height

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
Check if a certain coordinate point is on the text.
- `coordinate` coordinate point information
- `text` text parameter
   - `x` starting point x-axis value
   - `y` starting point y-axis value
   - `text` text content
   - `align` horizontal alignment
   - `baseline` vertical alignment
- `styles` styles
   - `color` color
   - `size` size
   - `family` font
   - `weight` weight