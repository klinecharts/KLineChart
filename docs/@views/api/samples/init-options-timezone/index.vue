<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-timezone-chart"
    chartId="init-options-timezone-chart"
    :code="data.js"/>
</template>