---
aside: false
editLink: false
---

# Basic

<script setup>
import Chart from '../../components/SampleChart.vue'
import { data } from '../../data/sample/basic/index.data.js'
</script>
<Chart :js="data['index.js']" :html="data['index.html']" title="Basic"/>

<!--@include: @/data/sample/basic/index.md-->
