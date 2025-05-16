<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setStyles-built-in"
    chartId="setStyles-built-in-chart"
    :code="data.js"/>
</template>