---
outline: deep
---

# setPaneOptions(options)
`setPaneOptions` 设置窗口配置。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/setPaneOptions.md -->

### 参数 {#parameters}
- `options` 窗口配置项。
  - `id` 窗口id。
  - `height` 高度。
  - `minHeight` 最小高度。
  - `dragEnabled` 是否可以拖拽调整高度。
  - `order` 顺序。
  - `state` 状态，支持 `normal` ， `maximize` 和 `minimize` 。

### 返回值 {#returns}
`setPaneOptions` 返回 `undefined`。

## 用法 {#usage}
<script setup>
import SetPaneOptionsBasic from '../../@views/api/samples/setPaneOptions-basic/index.vue'
import SetPaneOptionsDragEnabled from '../../@views/api/samples/setPaneOptions-dragEnabled/index.vue'
import SetPaneOptionsState from '../../@views/api/samples/setPaneOptions-state/index.vue'
</script>

### 基本使用 {#basic}
<SetPaneOptionsBasic/>

### 不可调整高度 {#dragEnabled}
<SetPaneOptionsDragEnabled/>

### 窗口最小化 {#state}
<SetPaneOptionsState/>
