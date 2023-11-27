---
aside: false
editLink: false
head:
  - - script
    - src: https://unpkg.com/klinecharts/dist/klinecharts.min.js
      defer: true
      id: klinecharts-script
---

# 数据加载

<script setup>
import Chart from '../components/SampleChart.vue'
import data from '../data/sample/data/index.json'
</script>
<Chart :js="data['index.js']" :html="data['index.html']" title="数据加载"/>

<!--@include: @/data/sample/data/index.md-->
