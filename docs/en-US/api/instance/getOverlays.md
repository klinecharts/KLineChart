---
outline: deep
---

# getOverlays(filter?)
`getOverlays` 获取覆盖物信息。

## 参考 {#reference}
<!-- @include: @/@views/api/references/instance/getOverlays.md -->

### 参数
- `filter` 过滤参数。
  - `id` 覆盖物id。
  - `name` 覆盖物名称。
  - `groupId` 编组id
  - `paneId` 窗口id。


### 返回值
`getOverlays` 返回 `Map<string, Overlay[]>` 。

## 用法 {#usage}
<script setup>
import GetOverlays from '../../../@views/api/samples/getOverlays/index.vue'
</script>

### 基本使用 {#basic}
<GetOverlays/>