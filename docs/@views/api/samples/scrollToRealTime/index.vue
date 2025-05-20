<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="scrollToRealTime"
    chartId="scrollToRealTime-chart"
    :code="data.js"/>
</template>