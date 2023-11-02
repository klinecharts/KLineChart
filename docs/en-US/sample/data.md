---
aside: false
editLink: false
---

# Data

<script setup>
import Chart from '../../components/SampleChart.vue'
import data from '../../data/sample/data/index.json'
</script>
<Chart :js="data['index.js']" :html="data['index.html']" title="Data"/>

<!--@include: @/data/sample/data/index.md-->
