<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-styles-extension-chart"
    chartId="init-options-styles-extension-chart"
    :code="data.js"/>
</template>