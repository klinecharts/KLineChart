<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setBarSpace"
    chartId="setBarSpace-chart"
    :code="data.js"/>
</template>