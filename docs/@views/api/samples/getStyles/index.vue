<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getStyles"
    chartId="getStyles-chart"
    :code="data.js"/>
</template>