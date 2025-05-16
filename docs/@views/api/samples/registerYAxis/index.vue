<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="custom-y-axis-basic"
    chartId="custom-y-axis-basic-chart"
    :code="data.js"/>
</template>