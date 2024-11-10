<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-locale-extension-chart"
    chartId="init-options-locale-extension-chart"
    :code="data.js"/>
</template>