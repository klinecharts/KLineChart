<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="overrideYAxis-extension"
    chartId="overrideYAxis-extension-chart"
    :code="data.js"/>
</template>