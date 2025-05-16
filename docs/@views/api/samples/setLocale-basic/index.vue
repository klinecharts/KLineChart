<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setLocale-basic"
    chartId="setLocale-basic-chart"
    :code="data.js"/>
</template>