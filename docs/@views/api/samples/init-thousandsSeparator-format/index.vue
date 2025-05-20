<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-thousandsSeparator-format"
    chartId="init-thousandsSeparator-format-chart"
    :code="data.js"/>
</template>