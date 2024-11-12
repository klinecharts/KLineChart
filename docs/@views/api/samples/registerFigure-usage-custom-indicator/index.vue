<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="registerfigure-usage-custom-indicator-chart"
    chartId="registerfigure-usage-custom-indicator-chart"
    :code="data.js"/>
</template>