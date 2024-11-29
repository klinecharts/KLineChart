---
outline: deep
---

# registerStyles(name, styles)
`registerStyles` used to extend style templates.

## Reference {#reference}
<!--@include: @/@views/api/references/chart/registerStyles.md-->

### Parameters {#parameters}
- `name` The name of the style template.
- `styles` Style configuration. See [styles](/en-US/guide/styles) for details. Incremental support.

### Returns {#returns}
`registerStyles` returns `undefined` .

## Usage {#usage}
<script setup>
import InitStylesExtension from '../../../@views/api/samples/init-styles-extension/index.vue'
import SetStylesExtension from '../../../@views/api/samples/setStyles-extension/index.vue'
</script>

### Using initialization {#init-styles}
<InitStylesExtension />

### Dynamic settings {#setStyles}
<SetStylesExtension />