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
    <div class="demo-shell home-card">
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
  border: none;
  border-radius: 0;
}

.demo-shell :deep(.chart-preview-loading) {
  background-color: var(--vp-c-bg);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.demo-shell :deep(.code-action-container) {
  background-color: transparent;
  border-top-color: var(--home-brand-border);
  border-bottom-color: var(--home-brand-border);
}

.demo-shell :deep(.code-action-container.hiddenCode) {
  border-bottom: none;
}

.demo-shell :deep(.chart-preview-code) {
  background-color: transparent;
}
</style>
