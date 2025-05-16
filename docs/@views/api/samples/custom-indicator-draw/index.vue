<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="custom-indicator-draw"
    chartId="custom-indicator-draw-chart"
    :code="data.js"/>
</template>