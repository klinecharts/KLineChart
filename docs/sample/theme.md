---
aside: false
editLink: false
---

# 主题

<script setup>
import { onUpdated, watch } from 'vue'
import { useData } from 'vitepress'

import Chart from '../components/SampleChart.vue'
import data from '../data/sample/theme/index.json'

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
<Chart :js="data['index.js']" :css="data['index.css']" :html="data['index.html']" title="主题"/>

<!--@include: @/data/sample/theme/index.md-->
