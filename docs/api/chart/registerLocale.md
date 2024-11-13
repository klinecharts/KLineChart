---
outline: deep
---

# registerLocale(locale, locales)
`registerLocale` 用于扩展多语言。

## 参考 {#reference}
<!--@include: @/@views/api/chart/registerLocale/reference.md-->

### 参数
- `locale` 扩展语言名称。
- `locales` 语言配置。

### 返回值
`registerLocale` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import InitOptionsLocaleExtension from '../../@views/api/samples/init-options-locale-extension/index.vue'
import SetLocaleExtension from '../../@views/api/samples/setLocale-extension/index.vue'
</script>

### 在初始化图表的时候使用扩展的语言 {#init-local}
<InitOptionsLocaleExtension />

### 使用实例方法 `setLocale` 设置扩展的语言 {#setlocale}
<SetLocaleExtension />
