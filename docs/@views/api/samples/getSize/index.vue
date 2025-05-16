<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getSize"
    chartId="getSize-chart"
    :code="data.js"/>
</template>