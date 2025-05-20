<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="createOverlay-basic"
    chartId="createOverlay-basic-chart"
    :code="data.js"/>
</template>