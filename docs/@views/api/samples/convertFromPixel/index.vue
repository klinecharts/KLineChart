<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    chartId="convertFromPixel-chart"
    title="convertFromPixel"
    :code="data.js"/>
</template>