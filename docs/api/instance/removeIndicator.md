---
outline: deep
---

# removeIndicator(filter?)
`removeIndicator` 移除指标。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/removeIndicator.md -->

### 参数 {#parameters}
- `filter` 过滤参数。
  - `id` 指标id。
  - `name` 指标名称。
  - `paneId` 窗口id。

### 返回值 {#returns}
`removeIndicator` 返回 `boolean` 。

## 用法 {#usage}
<script setup>
import RemoveIndicator from '../../@views/api/samples/removeIndicator/index.vue'
</script>

### 基本使用 {#basic}
<RemoveIndicator/>