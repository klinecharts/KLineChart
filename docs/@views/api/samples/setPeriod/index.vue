<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setPeriod"
    chartId="setPeriod-chart"
    :code="data.js"/>
</template>