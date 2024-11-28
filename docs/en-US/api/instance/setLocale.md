---
outline: deep
---

# setLocale(locale)
`setLocale` 设置图表的语言。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setLocale.md-->

### 参数
- `locale` 语言名称，已内置 `zh-CN` 和 `en-US` 。

### 返回值
`setLocale` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetLocaleBasic from '../../../@views/api/samples/setLocale-basic/index.vue'
import SetLocaleExtension from '../../../@views/api/samples/setLocale-extension/index.vue'
</script>

### 基本用法 {#basic}
<SetLocaleBasic/>

### 扩展语言 {#extension}
<SetLocaleExtension/>