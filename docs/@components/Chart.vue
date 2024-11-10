<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress';

import { transform } from '@babel/standalone'
import ResizeObserver from 'resize-observer-polyfill'

const { isDark } = useData()

import Loading from './Loading.vue'

const href = ref()

const props = defineProps(['height', 'js', 'css'])

const loading = ref(true)

let observer

onMounted(() => {
  href.value = location.href
  loading.value = true
  const container = document.getElementById('container')
  if (props.css) {
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = props.css
    container.appendChild(style)
  }
  if (props.js) {
    const transformJs = props.js + '\n' + 'window.chart = chart'
    const { code } = transform(transformJs,  {
      presets: [
        'es2015',
        ['stage-3', { decoratorsBeforeExport: true }],
      ],
      plugins: ['transform-modules-umd'],
    })
    const chartDom = document.createElement('div')
    chartDom.style.height = props.height || '430px'
    chartDom.id = 'k-line-chart'
    container.appendChild(chartDom)
    const script = document.createElement('script')
    script.innerHTML = code
    container.appendChild(script)
    window.chart.setStyles(isDark.value ? 'dark' : 'light')

    observer = new ResizeObserver(_ => {
      window.chart.resize()
    })
    observer.observe(container)
  }
  loading.value = false
})

watch(isDark, (newValue) => {
  if (newValue) {
    window.chart.setStyles('dark')
  } else {
    window.chart.setStyles('light')
  }
})

onUnmounted(() => {
  const container = document.getElementById('container')
  if (observer && container) {
    observer.unobserve(container)
  }
  if (window.klinecharts) {
    window.klinecharts.dispose('k-line-chart')
  }
})
</script>

<template>
<div id="container" style="position: relative;width: 100%;" :style="{ 'height': props.height }">
  <Loading v-if="loading"/>
</div>
</template>