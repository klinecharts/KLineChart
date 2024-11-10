<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-layout-basic-chart"
    chartId="init-options-layout-basic-chart"
    :code="data.js"/>
</template>