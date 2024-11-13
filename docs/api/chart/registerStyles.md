---
outline: deep
---

# registerStyles(name, styles)
`registerStyles` 用于扩展样式模版。

## 参考 {#reference}
<!--@include: @/@views/api/chart/registerStyles/reference.md-->

### 参数
- `name` 样式模板名。
- `styles` 样式配置。详情参阅 [样式](./styles.md) ，支持增量

### 返回值
`registerStyles` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import InitOptionsStylesExtension from '../../@views/api/samples/init-options-styles-extension/index.vue'
import SetStylesExtension from '../../@views/api/samples/setStyles-extension/index.vue'
</script>

### 在初始化图表的时候使用扩展的样式模版 {#init-styles}
<InitOptionsStylesExtension />

### 使用实例方法 `setStyles` 运用样式模版 {#setstyles}
<SetStylesExtension />