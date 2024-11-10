<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-styles-built-in-chart"
    chartId="init-options-styles-built-in-chart"
    :code="data.js"/>
</template>