<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setZoomAnchor"
    chartId="setZoomAnchor-chart"
    :code="data.js"/>
</template>