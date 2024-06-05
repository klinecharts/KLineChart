<script setup>
import { defineAsyncComponent } from 'vue'
import { useData } from 'vitepress'
import { data } from './index.data.js'
const Chart = defineAsyncComponent(() =>
  import('../Chart.vue')
)
const pressData = useData()
</script>
<template>
  <Chart :js="data.js" :html="data.html" :css="data.css" :title="pressData.title.value"/>
</template>
