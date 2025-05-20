<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setStyles-basic"
    chartId="setStyles-basic-chart"
    :code="data.js"/>
</template>