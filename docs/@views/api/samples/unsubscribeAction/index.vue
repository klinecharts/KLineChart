<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="subscribeAction"
    chartId="subscribeAction-chart"
    :code="data.js"/>
</template>