---
outline: deep
---

# setPaneOptions(options)
`setPaneOptions` 设置窗口配置。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/setPaneOptions.md -->

### 参数
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

### 返回值
`setPaneOptions` 返回 `undefined`。

## 用法 {#usage}
<script setup>
import SetPaneOptionsBasic from '../../../@views/api/samples/setPaneOptions-basic/index.vue'
import SetPaneOptionsDragEnabled from '../../../@views/api/samples/setPaneOptions-dragEnabled/index.vue'
import SetPaneOptionsState from '../../../@views/api/samples/setPaneOptions-state/index.vue'
import SetPaneOptionsAxis from '../../../@views/api/samples/setPaneOptions-axis/index.vue'
</script>

### 基本使用 {#basic}
<SetPaneOptionsBasic/>

### 不可调整高度
<SetPaneOptionsDragEnabled/>

### 最小化
<SetPaneOptionsState/>

### 坐标轴
<SetPaneOptionsAxis/>

