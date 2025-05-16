<script setup>
import ChartPreview from '../../../../@components/ChartPreview.vue';
import { data } from './index.data';
</script>

<template>
  <ChartPreview
    title="getSupportedLocales"
    :hiddenChart="true"
    :code="data.js"/>
</template>