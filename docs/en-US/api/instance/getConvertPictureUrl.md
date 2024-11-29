---
outline: deep
---

# getConvertPictureUrl(includeOverlay?, type?, backgroundColor?)
`getConvertPictureUrl` get the image URL after the chart is converted into an image.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/getConvertPictureUrl.md-->

### Parameters
- `includeOverlay` Whether to include the overlay lever.
- `type` The converted image type supports `png` , `jpeg` and `bmp`, the default is `jpeg` .
- `backgroundColor` Background color, default is `#FFFFFF` .

### Returns
`getConvertPictureUrl` returns `string` .

## Usage {#usage}
<script setup>
import GetConvertPictureUrl from '../../../@views/api/samples/getConvertPictureUrl/index.vue'
</script>

### Basic usage {#basic}
<GetConvertPictureUrl/>