<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="createOverlay-points"
    chartId="createOverlay-points-chart"
    :code="data.js"/>
</template>