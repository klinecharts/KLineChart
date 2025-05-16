<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setTimezone"
    chartId="setTimezone-chart"
    :code="data.js"/>
</template>