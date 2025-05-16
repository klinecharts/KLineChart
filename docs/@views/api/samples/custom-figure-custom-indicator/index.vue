<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="custom-figure-custom-indicator"
    chartId="custom-figure-custom-indicator-chart"
    :code="data.js"/>
</template>