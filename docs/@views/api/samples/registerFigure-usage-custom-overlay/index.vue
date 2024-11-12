<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="registerfigure-usage-custom-overlay-chart"
    chartId="registerfigure-usage-custom-overlay-chart"
    :code="data.js"/>
</template>