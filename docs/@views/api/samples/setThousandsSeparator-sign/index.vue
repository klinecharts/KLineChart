<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setThousandsSeparator-sign"
    chartId="setThousandsSeparator-sign-chart"
    :code="data.js"/>
</template>