<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getDataList"
    chartId="getDataList-chart"
    :code="data.js"/>
</template>