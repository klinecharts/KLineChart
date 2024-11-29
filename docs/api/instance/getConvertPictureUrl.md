---
outline: deep
---

# getConvertPictureUrl(includeOverlay?, type?, backgroundColor?)
`getConvertPictureUrl` 获取图表转换成图片后的图片url。

## 参考 {#reference}
<!--@include: @/@views/api/references/instance/getConvertPictureUrl.md-->

### 参数 {#parameters}
- `includeOverlay` 是否需要包含浮层。
- `type` 转换后的图片类型，支持 `png` ， `jpeg` 和 `bmp` ，默认为 `jpeg` 。
- `backgroundColor` 背景色，默认为 `#FFFFFF` 。

### 返回值 {#returns}
`getConvertPictureUrl` 返回 `string` 。

## 用法 {#usage}
<script setup>
import GetConvertPictureUrl from '../../@views/api/samples/getConvertPictureUrl/index.vue'
</script>

### 基本使用 {#basic}
<GetConvertPictureUrl/>