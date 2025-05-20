<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="createIndicator-basic"
    chartId="createIndicator-basic-chart"
    :code="data.js"/>
</template>