<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setPaneOptions-state"
    chartId="setPaneOptions-state-chart"
    :code="data.js"/>
</template>