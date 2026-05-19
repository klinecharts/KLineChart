<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="overrideYAxis-basic"
    chartId="overrideYAxis-basic-chart"
    :code="data.js"/>
</template>