<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="scrollToTimestamp"
    chartId="scrollToTimestamp-chart"
    :code="data.js"/>
</template>