<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getVisibleRange"
    chartId="getVisibleRange-chart"
    :code="data.js"/>
</template>