---
outline: deep
---

# setLayoutOptions(layout)
`setLayoutOptions` 设置图表的默认布局选项。该设置仅影响调用之后创建的窗格（pane）和 Y 轴，现有的窗格和 Y 轴保持不变。支持增量值。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setLayoutOptions.md-->

### 参数 {#parameters}
- `layout` 布局选项.
  - `barSpaceLimit` 蜡烛柱的最小最大限制值.
  - `pane` 窗口默认参数.
  - `yAxis` Y轴默认参数.

### 返回值 {#returns}
`setLayoutOptions` 返回 `undefined` 。

## 用法 {#usage}

<script setup>
import SetLayoutOptions from '../../@views/api/samples/setLayoutOptions/index.vue'
</script>

### 基本用法 {#basic}
<SetLayoutOptions/>
