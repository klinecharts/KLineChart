---
outline: deep
---

# getLayoutOptions()
`getLayoutOptions` 获取图表当前完整的默认布局配置。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/getLayoutOptions.md-->

### 参数 {#parameters}
`getLayoutOptions` 不接收任何参数。

### 返回值 {#returns}
`getLayoutOptions` 返回完整的布局配置 `Layout`，包含蜡烛柱宽度限制、窗格默认配置和 Y 轴默认配置。

## 用法 {#usage}
<script setup>
import GetLayoutOptions from '../../@views/api/samples/getLayoutOptions/index.vue'
</script>

### 基本使用 {#basic}
<GetLayoutOptions/>
