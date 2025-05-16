<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getPeriod"
    chartId="getPeriod-chart"
    :code="data.js"/>
</template>