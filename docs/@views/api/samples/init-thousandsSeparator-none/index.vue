<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-thousandsSeparator-none"
    chartId="init-thousandsSeparator-none-chart"
    :code="data.js"/>
</template>