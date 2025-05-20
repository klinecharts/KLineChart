<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setSymbol"
    chartId="setSymbol-chart"
    :code="data.js"/>
</template>