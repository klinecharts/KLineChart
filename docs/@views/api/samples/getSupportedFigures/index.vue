<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data';
</script>

<template>
  <ChartPreview
    title="getSupportedFigures"
    :hiddenChart="true"
    :code="data.js"/>
</template>