<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setFormatter-formatDate"
    chartId="setFormatter-formatDate-chart"
    :code="data.js"/>
</template>