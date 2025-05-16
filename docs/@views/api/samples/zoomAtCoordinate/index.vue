<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="zoomAtCoordinate"
    chartId="zoomAtCoordinate-chart"
    :code="data.js"/>
</template>