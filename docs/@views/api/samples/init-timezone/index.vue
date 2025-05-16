<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-timezone"
    chartId="init-timezone-chart"
    :code="data.js"/>
</template>