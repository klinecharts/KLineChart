<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getDom"
    chartId="getDom-chart"
    :code="data.js"/>
</template>