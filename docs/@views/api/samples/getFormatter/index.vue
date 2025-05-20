<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getFormatter"
    chartId="getFormatter-chart"
    :code="data.js"/>
</template>