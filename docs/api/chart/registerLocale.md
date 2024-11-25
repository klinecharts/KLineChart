---
outline: deep
---

# registerLocale(locale, locales)
`registerLocale` 用于扩展多语言。

## 参考 {#reference}
<!--@include: @/@views/api/references/chart/registerLocale.md-->

### 参数
- `locale` 扩展语言名称。
- `locales` 语言配置。

### 返回值
`registerLocale` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import InitLocaleExtension from '../../@views/api/samples/init-locale-extension/index.vue'
import SetLocaleExtension from '../../@views/api/samples/setLocale-extension/index.vue'
</script>

### 初始化时使用 {#init-local}
<InitLocaleExtension />

### 动态设置 {#setLocale}
<SetLocaleExtension />
