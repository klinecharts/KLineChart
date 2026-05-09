<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="overrideXAxis"
    chartId="overrideXAxis-chart"
    :code="data.js"/>
</template>
