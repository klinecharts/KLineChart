
<script setup>
import { onUpdated, watch, defineAsyncComponent } from 'vue'
import { useData } from 'vitepress'

import { data } from './index.data.js'
const Chart = defineAsyncComponent(() =>
  import('../Chart.vue')
)

const { isDark, title } = useData()

onUpdated(() => {
  document.getElementById('k-line-chart').style.backgroundColor = isDark.value ? '#1b1b1f' : '#ffffff'
})

watch(isDark, (newValue) => {
  const container = document.getElementById('k-line-chart')
  if (newValue) {
    container.style.backgroundColor = '#1b1b1f'
  } else {
    container.style.backgroundColor = '#ffffff'
  }
})
</script>
<template>
  <Chart :js="data.js" :html="data.html" :css="data.css" :title="title"/>
</template>