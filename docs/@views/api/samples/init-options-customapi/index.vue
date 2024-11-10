<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-customapi"
    chartId="init-options-customapi-chart"
    :code="data.js"/>
</template>