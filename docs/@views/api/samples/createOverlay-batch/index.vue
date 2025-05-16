<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="createOverlay-batch"
    chartId="createOverlay-batch-chart"
    :code="data.js"/>
</template>