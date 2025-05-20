<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="resetData"
    chartId="resetData-chart"
    :code="data.js"/>
</template>