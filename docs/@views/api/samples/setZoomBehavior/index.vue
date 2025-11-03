<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setZoomBehavior"
    chartId="setZoomBehavior-chart"
    :code="data.js"/>
</template>