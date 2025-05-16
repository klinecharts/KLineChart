<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data';
</script>

<template>
  <ChartPreview
    title="getSupportedIndicators"
    :hiddenChart="true"
    :code="data.js"/>
</template>