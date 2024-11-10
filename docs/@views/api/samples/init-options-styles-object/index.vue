<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-styles-object-chart"
    chartId="init-options-styles-object-chart"
    :code="data.js"/>
</template>