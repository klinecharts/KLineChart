---
aside: false
editLink: false
---

# 数据加载

<script setup>
import Chart from '../components/SampleChart.vue'
import data from '../data/sample/data/index.json'
</script>
<Chart :js="data['index.js']" :html="data['index.html']" title="数据加载"/>

<!--@include: @/data/sample/data/index.md-->
