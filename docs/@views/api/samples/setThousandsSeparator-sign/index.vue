<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    chartId="setThousandsSeparator-sign-chart"
    :code="data.js"/>
</template>