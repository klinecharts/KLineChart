---
outline: deep
---

# updateData(data)
`updateData` Update data.

::: tip Tip
This method will only match the timestamp of the current last data. If the timestamp is the same, it will be overwritten. If the timestamp is greater, it will be appended.
:::

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/updateData.md -->

### Parameters
- `data` K-line data, data format refers to [data](/en-US/guide/data-source).

### Returns
`updateData` returns `undefined` .

## Usage {#usage}
<script setup>
import UpdateData from '../../../@views/api/samples/updateData/index.vue'
</script>

### Basic usage {#basic}
<UpdateData/>