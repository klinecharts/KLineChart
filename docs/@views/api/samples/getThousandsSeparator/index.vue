<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    chartId="getThousandsSeparator-chart"
    :code="data.js"/>
</template>