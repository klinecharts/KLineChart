<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="init-options-thousandsseparator-chart"
    chartId="init-options-thousandsseparator-chart"
    :code="data.js"/>
</template>