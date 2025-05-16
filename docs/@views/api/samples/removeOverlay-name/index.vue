<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="removeOverlay-name"
    chartId="removeOverlay-name-chart"
    :code="data.js"/>
</template>