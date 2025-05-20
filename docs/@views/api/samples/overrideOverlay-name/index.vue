<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="overrideOverlay-name"
    chartId="overrideOverlay-name-chart"
    :code="data.js"/>
</template>