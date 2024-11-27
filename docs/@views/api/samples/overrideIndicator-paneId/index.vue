<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    chartId="overrideIndicator-paneId-chart"
    :code="data.js"/>
</template>