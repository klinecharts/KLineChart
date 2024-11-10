<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-decimalfold-chart"
    chartId="init-options-decimalfold-chart"
    :code="data.js"/>
</template>