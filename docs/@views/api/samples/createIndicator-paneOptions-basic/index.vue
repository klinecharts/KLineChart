<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="createIndicator-paneOptions-basic"
    chartId="createIndicator-paneOptions-basic-chart"
    :code="data.js"/>
</template>