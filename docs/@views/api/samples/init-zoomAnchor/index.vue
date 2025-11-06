<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-zoomAnchor"
    chartId="init-zoomAnchor-chart"
    :code="data.js"/>
</template>