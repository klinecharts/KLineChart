<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="executeAction"
    chartId="executeAction-chart"
    :code="data.js"/>
</template>