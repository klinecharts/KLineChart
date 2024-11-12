<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setstyles-extension-chart"
    chartId="setstyles-extension-chart"
    :code="data.js"/>
</template>