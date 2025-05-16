<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setFormatter-formatBigNumber"
    chartId="setFormatter-formatBigNumber-chart"
    :code="data.js"/>
</template>