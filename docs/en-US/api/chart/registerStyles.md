---
outline: deep
---

# registerStyles(name, styles)
`registerStyles` 用于扩展样式模版。

## 参考 {#reference}
<!--@include: @/@views/api/references/chart/registerStyles.md-->

### 参数
- `name` 样式模板名。
- `styles` 样式配置。详情参阅 [样式](./styles.md) ，支持增量。

### 返回值
`registerStyles` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import InitStylesExtension from '../../../@views/api/samples/init-styles-extension/index.vue'
import SetStylesExtension from '../../../@views/api/samples/setStyles-extension/index.vue'
</script>

### 初始化时使用 {#init-styles}
<InitStylesExtension />

### 动态设置 {#setStyles}
<SetStylesExtension />