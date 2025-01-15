---
outline: deep
---

# applyNewData(dataList, more?)
`applyNewData` add new data.

## Reference {#reference}
<!-- @include: @/@views/api/references/instance/applyNewData.md -->

### Parameters {#parameters}
- `dataList` K-line data array, the sub-item format refers to [data](/en-US/guide/data-source).
- `more` Whether there is more, affecting the triggering of [setLoadMoreDataCallback](/en-US/api/instance/setLoadMoreDataCallback).
  - `backward` Whether it can load backward.
  - `forward` Whether it can load forward.

### Returns {#returns}
`applyNewData` returns `undefined` .

## Usage {#usage}
<script setup>
import ApplyNewData from '../../../@views/api/samples/applyNewData/index.vue'
</script>

### Basic usage {#basic}
<ApplyNewData/>