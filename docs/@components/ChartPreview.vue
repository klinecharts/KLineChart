<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress';

import { codeToHtml } from 'shiki'

import { transform } from '@babel/standalone'
import ResizeObserver from 'resize-observer-polyfill'

const { isDark } = useData()

import Loading from './Loading.vue'

const href = ref()

const props = defineProps(['title', 'chartId', 'code', 'hiddenChart'])

const loading = ref(true)

const chartContainer = ref(null)

const observer = ref(null)
const codeHtml = ref(null)

onMounted(() => {
  href.value = location.href
  loading.value = true

  const highlightCode = async () => {
    codeHtml.value = await codeToHtml(props.code, {
      lang: 'javascript',
      themes: { 
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: 'light'
    })
  }

  if (props.code) {
    highlightCode()
    if (!props.hiddenChart) {
      const transformJs = props.code + '\n' + `window['chart_${props.chartId}'] = chart`
      const { code } = transform(transformJs, {
        presets: [
          'es2015',
          ['stage-3', { decoratorsBeforeExport: true }],
        ],
        plugins: ['transform-modules-umd'],
      })
      const chartDom = document.createElement('div')
      chartDom.style.height = '100%'
      chartDom.id = props.chartId
      chartContainer.value.appendChild(chartDom)
      const script = document.createElement('script')
      script.innerHTML = code
      chartContainer.value.appendChild(script)
      window[`chart_${props.chartId}`].setStyles(isDark.value ? 'dark' : 'light')

      observer.value = new ResizeObserver(_ => {
        window[`chart_${props.chartId}`].resize()
      })
      observer.value.observe(chartContainer.value)
    }
  }
  loading.value = false
})

watch(isDark, (newValue) => {
  if (!props.hiddenChart) {
    if (newValue) {
    window[`chart_${props.chartId}`].setStyles('dark')
    } else {
      window[`chart_${props.chartId}`].setStyles('light')
    }
  }
})

onUnmounted(() => {
  if (!props.hiddenChart) {
    if (observer.value && chartContainer.value) {
    observer.value.unobserve(chartContainer.value)
    }
    if (window.klinecharts) {
      window.klinecharts.dispose(props.chartId)
    }
  }
})
</script>

<template>
<div class="chart-preview">
  <div class="title">
    <span>{{ props.title }}</span>
  </div>
  <div class="content">
    <div class="content-item chart-preview-code" :class="{ 'hidden-chart': props.hiddenChart }" v-html="codeHtml"/>
    <div
      v-if="!props.hideChart"
      ref="chartContainer"
      class="content-item chart">
      <Loading v-if="loading"/>
    </div>
  </div>
</div>
</template>

<style scoped>
.chart-preview {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 8px;
  border: solid 1px var(--vp-c-gutter);
  background-color: var(--vp-code-block-bg);
  box-sizing: border-box;
}

h3 + .chart-preview {
  margin-top: 20px;
}

.title {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 0 20px;
  height: 44px;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border-bottom: solid 1px var(--vp-c-gutter);
  box-sizing: border-box;
}

.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.content-item {
  width: 100%;
  box-sizing: border-box;
}

.chart {
  position: relative;
  height: 380px;
}

@media (min-width: 960px) {
  .content {
    flex-direction: row;
    min-height: 300px;
  }
  .content-item {
    width: 50%;
  }
  .chart {
    height: auto;
  }
}
</style>

<style>
.chart-preview-code {
  overflow: auto;
  padding: 18px 20px;
  border-bottom: solid 1px var(--vp-c-gutter);
  font-size: var(--vp-code-font-size);
}

.chart-preview-code.hidden-chart {
  border-right: none;
  border-bottom: none;
  width: 100%;
}

.chart-preview-code .shiki {
  margin: 0;
  background-color: transparent!important;
}

html.dark .chart-preview-code .shiki span {
  color: var(--shiki-dark) !important;
}
@media (min-width: 960px) {
  .chart-preview-code {
    border-right: solid 1px var(--vp-c-gutter);
    border-bottom: none;
  }
}
</style>