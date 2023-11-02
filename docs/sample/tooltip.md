---
aside: false
editLink: false
---

# 提示条

<script setup>
import Chart from '../components/SampleChart.vue'
import data from '../data/sample/tooltip/index.json'
</script>
<Chart :js="data['index.js']" :html="data['index.html']" :css="data['index.css']" title="提示条"/>

<!--@include: @/data/sample/tooltip/index.md-->