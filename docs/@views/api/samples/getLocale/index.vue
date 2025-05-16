<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getLocale"
    chartId="getLocale-chart"
    :code="data.js"/>
</template>