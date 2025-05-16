<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getTimezone"
    chartId="getTimezone-chart"
    :code="data.js"/>
</template>