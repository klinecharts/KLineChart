---
outline: deep
---

# setStyles(styles)
`setStyles` set the chart style.

## Reference {#reference}
<!--@include: @/@views/api/references/instance/setStyles.md-->

### Parameters
- `styles` Style, which can be a style name registered by `klinecharts.registerStyles`, or `Styles`. For details about `Styles`, see [Styles](/en-US/guide/styles). Incremental values ​​are supported.

### Returns
`setStyles` returns `undefined` .

## Usage {#usage}
<script setup>
import SetStylesBasic from '../../../@views/api/samples/setStyles-basic/index.vue'
import SetStylesBuiltIn from '../../../@views/api/samples/setStyles-built-in/index.vue'
import SetStylesExtension from '../../../@views/api/samples/setStyles-extension/index.vue'
</script>

### Basic usage {#basic}
<SetStylesBasic/>

### Built-in templates {#built-in}
<SetStylesBuiltIn/>

### Custom templates {#extension}
<SetStylesExtension/>