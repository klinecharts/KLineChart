<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setPaneOptions-axis-extension"
    chartId="setPaneOptions-axis-extension-chart"
    :code="data.js"/>
</template>