<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="removeIndicator"
    chartId="removeIndicator-chart"
    :code="data.js"/>
</template>