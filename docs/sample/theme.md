---
aside: false
editLink: false
---

# 主题

<script setup>
import { onUpdated, watch } from 'vue'
import { useData } from 'vitepress'

import Chart from '../components/sample/Chart.vue'
import { js, css, html } from '../components/sample/theme/index.js'

const { isDark } = useData()

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
<Chart :js="js" :css="css" :html="html"/>

<!--@include: @/components/sample/theme/index.md-->
