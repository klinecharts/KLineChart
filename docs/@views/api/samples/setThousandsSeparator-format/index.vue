<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    chartId="setThousandsSeparator-format-chart"
    :code="data.js"/>
</template>