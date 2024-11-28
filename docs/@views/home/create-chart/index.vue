<script setup>
import { ref } from 'vue';
import { useData } from 'vitepress';
const { lang } = useData()

import Section from '../Section.vue';

import ChartPreview from '../../../@components/ChartPreview.vue';

import { data } from './index.data.js'

</script>

<template>
  <Section
    :title="lang === 'zh-CN' ? '简单快速创建图表' : 'Create chart easily and quickly'"
    :description="lang === 'zh-CN' ? 'KLineChart 让你使用几行代码就可以创建一个金融图表，同时可以使用内置的多种常用技术指标，让图表看起来更专业。' : 'KLineChart allows you to create a financial chart with just a few lines of code, while also utilizing various commonly used technical indicators built-in to make the chart look more professional.'">
    <ChartPreview
      :title="lang === 'zh-CN' ? '快速创建' : 'Quick started'"
      chartId="k-line-chart"
      :code="data.js"
      chartHeight="450"/>
  </Section>
</template>

<style scoped>
::v-deep.section {
  padding-top: 60px;
}

@media (min-width: 640px) {
  ::v-deep.section {
    padding-top: 126px;
  }
}
</style>