<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-layout-order-chart"
    chartId="init-options-layout-order-chart"
    :code="data.js"/>
</template>