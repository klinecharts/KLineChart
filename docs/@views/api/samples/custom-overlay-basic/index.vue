<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="custom-overlay-basic"
    chartId="custom-overlay-basic-chart"
    :code="data.js"/>
</template>