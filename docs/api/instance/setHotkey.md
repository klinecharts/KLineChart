---
outline: deep
---

# setHotkey(hotkey)
`setHotkey` 设置快捷键配置。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/setHotkey.md-->

### 参数 {#parameters}
- `hotkey` 快捷键配置。
  - `enabled` 是否启用快捷键。
  - `exclude` 排除的全局快捷键名称列表。

### 返回值 {#returns}
`setHotkey` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import SetHotkey from '../../@views/api/samples/setHotkey/index.vue'
</script>

### 基本用法 {#basic}
<SetHotkey/>
