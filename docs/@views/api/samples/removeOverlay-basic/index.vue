<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="removeOverlay-basic"
    chartId="removeOverlay-basic-chart"
    :code="data.js"/>
</template>