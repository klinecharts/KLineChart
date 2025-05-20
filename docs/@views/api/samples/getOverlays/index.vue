<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getOverlays"
    chartId="getOverlays-chart"
    :code="data.js"/>
</template>