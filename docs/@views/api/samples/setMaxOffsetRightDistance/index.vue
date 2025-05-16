<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setMaxOffsetRightDistance"
    chartId="setMaxOffsetRightDistance-chart"
    :code="data.js"/>
</template>