<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getDecimalFold"
    chartId="getDecimalFold-chart"
    :code="data.js"/>
</template>