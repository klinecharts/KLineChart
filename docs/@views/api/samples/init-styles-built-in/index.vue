<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-styles-built-in"
    chartId="init-styles-built-in-chart"
    :code="data.js"/>
</template>