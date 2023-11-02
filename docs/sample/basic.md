---
aside: false
editLink: false
---

# 基础展示

<script setup>
import Chart from '../components/SampleChart.vue'
import data from '../data/sample/basic/index.json'
</script>
<Chart :js="data['index.js']" :html="data['index.html']" title="基础展示"/>

<!--@include: @/data/sample/basic/index.md-->
