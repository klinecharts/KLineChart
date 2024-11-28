---
outline: deep
---

# getSize(filter?)
`getSize` 获取图表的尺寸。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/getSize.md-->

### 参数
- `filter` 过滤条件。
  - `paneId` 窗口 id 。
  - `position` 位置，支持 `root` ， `main` 和 `yAxis` 。

### 返回值
`getDom` 返回一个包含尺寸信息的 `Bounding` 对象或者 `null` 。


## 用法 {#usage}
<script setup>
import GetSize from '../../../@views/api/samples/getSize/index.vue'
</script>

### 基本使用 {#basic}
<GetSize/>