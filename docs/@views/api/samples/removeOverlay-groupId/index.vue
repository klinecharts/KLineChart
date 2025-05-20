<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data'
</script>

<template>
  <ChartPreview
    title="removeOverlay-groupId"
    chartId="removeOverlay-groupId-chart"
    :code="data.js"/>
</template>