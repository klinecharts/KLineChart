<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="setHotkey"
    chartId="setHotkey-chart"
    :code="data.js"/>
</template>
