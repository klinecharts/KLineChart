<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setStyles-colorful-candle"
    chartId="setStyles-colorful-candle-chart"
    :code="data.js"/>
</template>
