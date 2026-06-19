<script setup>
import { useData } from 'vitepress'

const { lang } = useData()

import i18n from '../../../@i18n'

import Section from '../Section.vue'

import ChartPreview from '../../../@components/ChartPreview.vue'

import { data } from './index.data.js'
</script>

<template>
  <Section
    out-class="quick-create-chart"
    :title="i18n('view_home_quick_create_chart_title', lang)"
    :description="i18n('view_home_quick_create_chart_desc', lang)"
  >
    <div class="demo-shell">
      <ChartPreview
        :title="i18n('view_home_quick_create', lang)"
        chartId="k-line-chart"
        :code="data.js"
        chartHeight="450"
      />
    </div>
  </Section>
</template>

<style scoped>
.demo-shell {
  width: 100%;
}

.demo-shell :deep(.chart-preview) {
  background-color: transparent;
  border-radius: 8px;
}

.demo-shell :deep(.loading) {
  background-color: transparent;
}
</style>
