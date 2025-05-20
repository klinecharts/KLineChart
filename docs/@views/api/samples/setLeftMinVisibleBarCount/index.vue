<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setLeftMinVisibleBarCount"
    chartId="setLeftMinVisibleBarCount-chart"
    :code="data.js"/>
</template>