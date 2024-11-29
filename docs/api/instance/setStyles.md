---
outline: deep
---

# setStyles(styles)
`setStyles` 设置图表样式。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setStyles.md-->

### 参数 {#parameters}
- `styles` 样式，可以是通过 `klinecharts.registerStyles` 注册的样式名，也可以是 `Styles` ， `Styles` 详情参阅 [样式](./styles.md) ，支持增量。

### 返回值 {#returns}
`setStyles` 返回 `undefined` 。


## 用法 {#usage}
<script setup>
import SetStylesBasic from '../../@views/api/samples/setStyles-basic/index.vue'
import SetStylesBuiltIn from '../../@views/api/samples/setStyles-built-in/index.vue'
import SetStylesExtension from '../../@views/api/samples/setStyles-extension/index.vue'
</script>

### 基本使用 {#basic}
<SetStylesBasic/>

### 内置模版 {#built-in}
<SetStylesBuiltIn/>

### 自定义模版 {#extension}
<SetStylesExtension/>