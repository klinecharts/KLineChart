<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="resize"
    chartId="resize-chart"
    :code="data.js"/>
</template>