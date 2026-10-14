<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue'
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setLayoutOptions"
    chartId="setLayoutOptions-chart"
    :code="data.js"/>
</template>