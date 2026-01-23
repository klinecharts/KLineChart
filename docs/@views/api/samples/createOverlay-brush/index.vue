<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="createOverlay-brush"
    chartId="createOverlay-brush-chart"
    :code="data.js"/>
</template>
