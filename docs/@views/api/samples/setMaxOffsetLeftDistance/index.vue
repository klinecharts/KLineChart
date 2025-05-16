<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setMaxOffsetLeftDistance"
    chartId="setMaxOffsetLeftDistance-chart"
    :code="data.js"/>
</template>