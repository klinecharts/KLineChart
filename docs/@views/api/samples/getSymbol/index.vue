<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getSymbol"
    chartId="getSymbol-chart"
    :code="data.js"/>
</template>