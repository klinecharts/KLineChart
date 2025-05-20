<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setRightMinVisibleBarCount"
    chartId="setRightMinVisibleBarCount-chart"
    :code="data.js"/>
</template>