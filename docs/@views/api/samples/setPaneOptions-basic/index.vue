<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setPaneOptions-basic"
    chartId="setPaneOptions-basic-chart"
    :code="data.js"/>
</template>