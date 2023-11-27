---
aside: false
editLink: false
head:
  - - script
    - src: https://unpkg.com/klinecharts/dist/klinecharts.min.js
      defer: true
      id: klinecharts-script
---

# 覆盖物

<script setup>
import Chart from '../components/SampleChart.vue'
import data from '../data/sample/overlay/index.json'
</script>
<Chart :js="data['index.js']" :html="data['index.html']" :css="data['index.css']" title="覆盖物"/>

<!--@include: @/data/sample/overlay/index.md-->


