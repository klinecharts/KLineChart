---
aside: false
editLink: false
head:
  - - script
    - src: https://unpkg.com/klinecharts/dist/klinecharts.min.js
      defer: true
      id: klinecharts-script
---

# Timezone

<script setup>
import Chart from '../../components/SampleChart.vue'
import data from '../../data/sample/timezone/index.json'
</script>
<Chart :js="data['index.js']" :html="data['index.html']" :css="data['index.css']" title="Timezone"/>

<!--@include: @/data/sample/timezone/index.md-->