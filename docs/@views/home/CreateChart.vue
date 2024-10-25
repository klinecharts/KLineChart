<script setup>
import { ref } from 'vue';
import { useData } from 'vitepress';

import Section from './Section.vue';
import CodeHighlight from '../../@components/CodeHighlight.vue';
import Chart from '../../@components/Chart.vue';

const { lang } = useData()

const code = ref(
  `import { init } from 'klinecharts';

const chart = init('k-line-chart');

chart.createIndicator('MA', false, { id: 'candle_pane' });
chart.createIndicator('VOL');

fetch('/data/kline.json').then(res => {
  return res.json();
}).then(dataList => {
  chart.applyNewData(dataList);
})
`
)

</script>

<template>
  <Section
    :title="lang === 'zh-CN' ? '简单快速创建图表' : 'Create chart easily and quickly'"
    :subTitle="lang === 'zh-CN' ? 'KLineChart 让你使用几行代码就可以创建一个金融图表，同时可以使用内置的多种常用技术指标，让图表看起来更专业。' : 'KLineChart allows you to create a financial chart with just a few lines of code, while also utilizing various commonly used technical indicators built-in to make the chart look more professional.'">
    <div class="create-chart">
      <div class="code-container">
        <CodeHighlight :code="code">
          <span class="title">chart.js</span>
        </CodeHighlight>
      </div>
      <div class="chart-container">
        <span class="title" style="height: 58px;">
          <span class="address">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24">
              <path fill="currentColor" d="M5.5 7.5a6.5 6.5 0 0 1 13 0V9h2v13h-17V9h2zm2 1.5h9V7.5a4.5 4.5 0 1 0-9 0zm-2 2v9h13v-9zm4.5 4.5a2 2 0 1 1 4 0a2 2 0 0 1-4 0"/>
            </svg>
            &nbsp;https://klinecharts.com/sample/basic
          </span>
        </span>
        <Chart :js="code" height="360px"/>
      </div>
    </div>
  </Section>
</template>

<style scoped>
::v-deep.section {
  padding-top: 60px;
}

.create-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 0 20px;
  height: 46px;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border-bottom: solid 1px var(--vp-c-gutter);
}

.code-container {
  width: 100%;
}

.chart-container {
  width: 100%;
  border-radius: 12px;
  border: solid 1px var(--vp-c-gutter);
  background-color: var(--vp-code-block-bg);
  padding-bottom: 6px;
}

.address {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 34px;
  border-radius: 20px;
  width: 100%;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-alt);
}

@media (min-width: 640px) {
  ::v-deep.section {
    padding-top: 118px;
  }
}

@media (min-width: 960px) {
  .create-chart {
    flex-direction: row;
  }

  .code-container, .chart-container {
    width: calc(50% - 10px);
  }
}
</style>