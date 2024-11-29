---
outline: deep
---

# registerLocale(locale, locales)
`registerLocale` used to custom locale.

## Reference {#reference}
<!--@include: @/@views/api/references/chart/registerLocale.md-->

### Parameters {#parameters}
- `locale` Locale name.
- `locales` Locale configuration.

### Returns {#returns}
`registerLocale` returns `undefined` .

## Usage {#usage}
<script setup>
import InitLocaleExtension from '../../../@views/api/samples/init-locale-extension/index.vue'
import SetLocaleExtension from '../../../@views/api/samples/setLocale-extension/index.vue'
</script>

### Using initialization {#init-local}
<InitLocaleExtension />

### Dynamic settings {#setLocale}
<SetLocaleExtension />
