<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-basic"
    chartId="init-basic-chart"
    :code="data.js"/>
</template>