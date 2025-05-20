<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setPaneOptions-axis-basic"
    chartId="setPaneOptions-axis-basic-chart"
    :code="data.js"/>
</template>