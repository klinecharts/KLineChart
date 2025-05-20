<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setDecimalFold-format"
    chartId="setDecimalFold-format-chart"
    :code="data.js"/>
</template>