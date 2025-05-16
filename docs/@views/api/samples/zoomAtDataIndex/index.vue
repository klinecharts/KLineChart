<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="zoomAtDataIndex"
    chartId="zoomAtDataIndex-chart"
    :code="data.js"/>
</template>