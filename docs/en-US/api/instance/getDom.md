---
outline: deep
---

# getDom(filter?)
`getDom` 获取图表 dom 元素。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/getDom.md -->

### 参数
- `filter` 过滤条件。
  - `paneId` 窗口 id 。
  - `position` 位置，支持 `root` ， `main` 和 `yAxis` 。

### 返回值
`getDom` 返回一个 `HTMLElement` 或者 `null` 。

## 用法 {#usage}
<script setup>
import GetDom from '../../../@views/api/samples/getDom/index.vue'
</script>

### 基本使用 {#basic}
<GetDom/>