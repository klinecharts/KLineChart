<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-locale-built-in"
    chartId="init-locale-built-in-chart"
    :code="data.js"/>
</template>