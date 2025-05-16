<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-decimalFold-none"
    chartId="init-decimalFold-none-chart"
    :code="data.js"/>
</template>