---
outline: deep
---

# applyNewData(dataList, more?)
`applyNewData` 加载新数据。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/applyNewData.md -->

### 参数 {#parameters}
- `dataList` K 线数据数组，子项格式参照 [数据](/guide/data-source)。
- `more` 是否还有更多，影响 [setLoadMoreDataCallback](/api/instance/setLoadMoreDataCallback) 触发。
  - `backward` 是否可以向后加载。
  - `forward` 是否可以向前加载。

### 返回值 {#returns}
`applyNewData` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import ApplyNewData from '../../@views/api/samples/applyNewData/index.vue'
</script>

### 基本用法 {#basic}
<ApplyNewData/>