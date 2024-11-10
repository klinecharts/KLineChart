<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-locale-built-in-chart"
    chartId="init-options-locale-built-in-chart"
    :code="data.js"/>
</template>