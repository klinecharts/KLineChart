<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setDecimalFold-threshold"
    chartId="setDecimalFold-threshold-chart"
    :code="data.js"/>
</template>