<script setup>
import { onMounted, ref } from 'vue'
import { codeToHtml } from 'shiki'

const props = defineProps(['code', 'width'])

const code = ref('')

onMounted(async () => {
  code.value = await codeToHtml(props.code, {
    lang: 'javascript',
    themes: { 
      light: 'github-light',
      dark: 'github-dark',
    },
    defaultColor: 'light'
  })
})
</script>

<template>
  <div
    class="code-highlight"
    :style="{ 'width': props.width }">
    <slot></slot>
    <div class="code" v-html="code"/>
  </div>
</template>

<style>
.code-highlight {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: solid 1px var(--vp-c-gutter);
  background-color: var(--vp-code-block-bg)!important;
}

.code-highlight .code {
  overflow: auto;
  padding: 18px 20px;
}

.code-highlight .code .shiki {
  margin: 0;
  background-color: transparent!important;
}

html.dark .code-highlight .code .shiki span {
  color: var(--shiki-dark) !important;
}
</style>