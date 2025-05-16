<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setZoomEnabled"
    chartId="setZoomEnabled-chart"
    :code="data.js"/>
</template>