<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    chartId="createIndicator-paneOptions-axis-chart"
    :code="data.js"/>
</template>