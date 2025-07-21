---
outline: deep
---

# setBarSpace(space)
`setBarSpace` 设置图表单根蜡烛柱所占的空间大小。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setBarSpace.md-->

### 参数 {#parameters}
- `space` 空间大小，默认范围在 1 到 50 之间，可以通过`setBarSpaceLimit`设置。

### 返回值 {#returns}
`setBarSpace` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetBarSpace from '../../@views/api/samples/setBarSpace/index.vue'
</script>

### 基本用法 {#basic}
<SetBarSpace/>