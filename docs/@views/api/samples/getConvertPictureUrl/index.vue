<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="getConvertPictureUrl"
    chartId="getConvertPictureUrl-chart"
    :code="data.js"/>
</template>