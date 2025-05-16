<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-decimalFold-format"
    chartId="init-decimalFold-format-chart"
    :code="data.js"/>
</template>