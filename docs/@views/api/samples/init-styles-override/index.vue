<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-styles-override"
    chartId="init-styles-override-chart"
    :code="data.js"/>
</template>