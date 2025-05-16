<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-locale-extension"
    chartId="init-locale-extension-chart"
    :code="data.js"/>
</template>