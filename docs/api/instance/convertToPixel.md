---
outline: deep
---

# convertToPixel(value, finder?)
`convertToPixel` 将值转换成坐标。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/convertToPixel.md -->

### 参数 {#parameters}
- `value` 需要转换的值，可以是当个对象，也可以是数组。
  - `dataIndex` 数据索引，如果 `dataIndex` 和 `timestamp` 同时存在，则依据索引转换。
  - `timestamp` 时间戳。
  - `value` 对应y轴的值。
- `finder` 过滤条件。
  - `paneId` 窗口id。
  - `absolute` 是否是绝对坐标，只作用于y轴。

### 返回值 {#returns}
`convertToPixel` 返回 `{ x?: number, y?: number }` 或者 `Array<{ x?: number, y?: number }>` 。

## 用法 {#usage}
<script setup>
import ConvertToPixel from '../../@views/api/samples/convertToPixel/index.vue'
</script>

### 基本用法 {#basic}
<ConvertToPixel/>