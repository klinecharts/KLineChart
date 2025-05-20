<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="custom-x-axis"
    chartId="custom-x-axis-chart"
    :code="data.js"/>
</template>