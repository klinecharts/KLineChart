<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="overrideOverlay-basic"
    chartId="overrideOverlay-basic-chart"
    :code="data.js"/>
</template>