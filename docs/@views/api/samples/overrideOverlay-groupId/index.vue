<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="overrideOverlay-groupId"
    chartId="overrideOverlay-groupId-chart"
    :code="data.js"/>
</template>