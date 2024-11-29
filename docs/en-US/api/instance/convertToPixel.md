---
outline: deep
---

# convertToPixel(value, finder?)
`convertToPixel` convert values ​​to coordinates.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/convertToPixel.md -->

### Parameters
- `value` The value to be converted can be an object or an array.
  - `dataIndex` Data index. If both `dataIndex` and `timestamp` exist, the conversion is based on the index.
  - `timestamp` Timestamp.
  - `value` The corresponding y-axis value.
- `finder` Filter conditions.
  - `paneId` Pane id.
  - `absolute` Whether it is an absolute coordinate, only applies to the y-axis.

### 返回值
`convertToPixel` returns `{ x?: number, y?: number }` or `Array<{ x?: number, y?: number }>` .

## Usage {#usage}
<script setup>
import ConvertToPixel from '../../../@views/api/samples/convertToPixel/index.vue'
</script>

### Basic usage {#basic}
<ConvertToPixel/>