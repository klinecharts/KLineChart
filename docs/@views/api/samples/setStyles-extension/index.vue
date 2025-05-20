<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setStyles-extension"
    chartId="setStyles-extension-chart"
    :code="data.js"/>
</template>