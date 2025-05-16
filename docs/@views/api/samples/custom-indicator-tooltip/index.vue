<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="custom-indicator-tooltip"
    chartId="custom-indicator-tooltip-chart"
    :code="data.js"/>
</template>