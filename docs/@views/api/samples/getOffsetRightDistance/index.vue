<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getOffsetRightDistance"
    chartId="getOffsetRightDistance-chart"
    :code="data.js"/>
</template>