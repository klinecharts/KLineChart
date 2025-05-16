<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="zoomAtTimestamp"
    chartId="zoomAtTimestamp-chart"
    :code="data.js"/>
</template>