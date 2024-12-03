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
  - `axis` 坐标轴配置。
    - `name` 坐标轴名称。
    - `reverse` 是否反向。
    - `inside` 是否在内部。
    - `position` 位置，支持 `left` 和 `right` 。
    - `scrollZoomEnabled` 是否允许滚动缩放。
    - `gap` 上下边距配置。
      - `top` 上边距。
      - `bottom` 下边距。
    - `createRange` 创建轴上取值范围回调方法。如果是x轴此方法无用。
    - `createTicks` 创建分割信息回调方法。

### 返回值 {#returns}
`setPaneOptions` 返回 `undefined`。

## 用法 {#usage}
<script setup>
import SetPaneOptionsBasic from '../../@views/api/samples/setPaneOptions-basic/index.vue'
import SetPaneOptionsDragEnabled from '../../@views/api/samples/setPaneOptions-dragEnabled/index.vue'
import SetPaneOptionsState from '../../@views/api/samples/setPaneOptions-state/index.vue'
import SetPaneOptionsAxisBasic from '../../@views/api/samples/setPaneOptions-axis-basic/index.vue'
import SetPaneOptionsAxisExtension from '../../@views/api/samples/setPaneOptions-axis-extension/index.vue'
</script>

### 基本使用 {#basic}
<SetPaneOptionsBasic/>

### 不可调整高度 {#dragEnabled}
<SetPaneOptionsDragEnabled/>

### 窗口最小化 {#state}
<SetPaneOptionsState/>

### 设置坐标轴基础属性 {#axis-basic}
<SetPaneOptionsAxisBasic/>

### 坐标轴简单自定义 {#axis-extension}
<SetPaneOptionsAxisExtension/>

