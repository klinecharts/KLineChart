---
outline: deep
---

# convertFromPixel(coordinate, finder?)
`convertFromPixel` convert coordinates to values.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/convertFromPixel.md -->

### Parameters {#parameters}
- `coordinate` The coordinates to be converted can be an object or an array.
  - `x` The x-axis value.
  - `y` The y-axis value.
- `finder` Filter conditions.
  - `paneId` Pane id.
  - `absolute` Whether it is an absolute coordinate, only applies to the y-axis.

### Returns {#returns}
`convertFromPixel` returns `{ timestamp?: number, dataIndex?: number, value?: number }` or `Array<{ timestamp?: number, dataIndex?: number, value?: number }>` .

## Usage {#usage}
<script setup>
import ConvertFromPixel from '../../../@views/api/samples/convertFromPixel/index.vue'
</script>

### Basic usage {#basic}
<ConvertFromPixel/>