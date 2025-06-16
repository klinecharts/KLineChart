<script setup>
import { useData } from 'vitepress';
const { lang } = useData()

import i18n from '../../../@i18n';

import Section from '../Section.vue';

import ChartPreview from '../../../@components/ChartPreview.vue';

import { data } from './index.data.js'

</script>

<template>
  <Section
    out-class="quick-create-chart"
    :title="i18n('view_home_quick_create_chart_title', lang)"
    :description="i18n('view_home_quick_create_chart_desc', lang)">
    <ChartPreview
      :title="i18n('view_home_quick_create', lang)"
      chartId="k-line-chart"
      :code="data.js"
      chartHeight="450"/>
  </Section>
</template>

<style scoped>
.quick-create-chart {
  padding-top: 60px;
}

@media (min-width: 640px) {
  .quick-create-chart {
    padding-top: 126px;
  }
}
</style>