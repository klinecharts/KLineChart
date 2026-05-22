---
outline: deep
---

# registerHotkey(hotkey)
`registerHotkey` 用于全局注册快捷键。

## 参考 {#reference}
<!--@include: @/@views/api/references/chart/registerHotkey.md-->

### 参数 {#parameters}
- `hotkey` 快捷键配置。
  - `name` 名称，用于全局唯一标识，重复注册相同名称会覆盖已有配置。
  - `keys` 按键组合，可以是字符串或字符串数组，例如 `R`、`Shift+Equal`、`['Shift+=', 'Shift+NumpadAdd']`。
  - `preventDefault` 是否阻止浏览器默认行为，默认 `true`。
  - `stopPropagation` 是否阻止事件冒泡，默认 `false`。
  - `check` 执行前校验，返回 `false` 时不会执行 `action`。
    - `params.chart` 当前触发快捷键的图表实例。
    - `params.event` 原始键盘事件。
    - `params.key` 规范化后的按键字符串。
    - `params.hotkey` 当前快捷键配置。
  - `action` 快捷键触发后的执行方法，参数同 `check`。
  - `extendData` 自定义扩展数据。

### 返回值 {#returns}
`registerHotkey` 返回 `undefined` 。

## 用法 {#usage}
<script setup>
import RegisterHotkey from '../../@views/api/samples/registerHotkey/index.vue'
</script>

### 基本使用 {#basic}
<RegisterHotkey/>
