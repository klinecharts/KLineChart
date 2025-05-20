<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="scrollToDataIndex"
    chartId="scrollToDataIndex-chart"
    :code="data.js"/>
</template>