<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getZoomAnchor"
    chartId="getZoomAnchor-chart"
    :code="data.js"/>
</template>