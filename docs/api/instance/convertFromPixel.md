---
outline: deep
---

# convertFromPixel(coordinate, finder?)
`convertFromPixel` 将坐标转换成值。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/convertFromPixel.md -->

### 参数 {#parameters}
- `coordinate` 需要转换的坐标，可以是当个对象，也可以是数组。
  - `x` 横坐标值。
  - `y` 纵坐标值。
- `finder` 过滤条件。
  - `paneId` 窗口id。
  - `absolute` 是否是绝对坐标，只作用于y轴。

### 返回值 {#returns}
`convertFromPixel` 返回 `{ timestamp?: number, dataIndex?: number, value?: number }` 或者 `Array<{ timestamp?: number, dataIndex?: number, value?: number }>` 。

## 用法 {#usage}
<script setup>
import ConvertFromPixel from '../../@views/api/samples/convertFromPixel/index.vue'
</script>

### 基本用法 {#basic}
<ConvertFromPixel/>