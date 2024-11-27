---
outline: deep
---

# removeOverlay(filter?)
`removeOverlay` 移除覆盖物。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/removeOverlay.md -->

### 参数
- `filter` 过滤参数。
  - `id` 覆盖物id。
  - `name` 覆盖物名称。
  - `groupId` 编组id
  - `paneId` 窗口id。


### 返回值
`removeOverlay` 返回 `boolean` 。

## 用法 {#usage}
<script setup>
import RemoveOverlayBasic from '../../@views/api/samples/removeOverlay-basic/index.vue'
import RemoveOverlayName from '../../@views/api/samples/removeOverlay-name/index.vue'
import RemoveOverlayGroupId from '../../@views/api/samples/removeOverlay-groupId/index.vue'
</script>

### 基本使用 {#basic}
<RemoveOverlayBasic/>

### 按名称移除 {#name}
<RemoveOverlayName/>

### 按组移除 {#groupId}
<RemoveOverlayGroupId/>