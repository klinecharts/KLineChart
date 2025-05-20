<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="createIndicator-object"
    chartId="createIndicator-object-chart"
    :code="data.js"/>
</template>