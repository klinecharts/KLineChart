---
outline: deep
---

# getHotkey(name)
`getHotkey` 获取已注册的快捷键配置。

## 参考 {#reference}
<!--@include: @/@views/api/references/chart/getHotkey.md-->

### 参数 {#parameters}
- `name` 快捷键名称。

### 返回值 {#returns}
`getHotkey` 返回 `HotkeyTemplate` 或者 `null` 。

## 用法 {#usage}
<script setup>
import GetHotkey from '../../@views/api/samples/getHotkey-chart/index.vue'
</script>

### 基本使用 {#basic}
<GetHotkey/>
