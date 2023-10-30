<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue'
import { useData } from 'vitepress';

import stackBlitz from '@stackblitz/sdk'

import { transform } from '@babel/standalone'

const { isDark, lang } = useData()

import Tooltip from '../Tooltip.vue';

const href = ref()

const props = defineProps(['js', 'css', 'html', 'title', 'description', 'version'])

const resizeHandler = () => {
  window.addEventListener('resize', () => {
    window.chart.resize()
  })
}

onMounted(() => {
  href.value = location.href
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
    chartDom.style.height = '430px'
    chartDom.id = 'k-line-chart'
    container.appendChild(chartDom)
    window.addEventListener('resize', resizeHandler)
    const script = document.createElement('script')
    script.innerHTML = code
    container.appendChild(script)
    window.chart.setStyles(isDark.value ? 'dark' : 'light')
  }
})

watch(isDark, (newValue) => {
  if (newValue) {
    window.chart.setStyles('dark')
  } else {
    window.chart.setStyles('light')
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  window.klinecharts.dispose('k-line-chart')
})

function openStackBlitz () {
  const files = {
    'index.js': props.js,
    'index.html': props.html,
  }
  if (props.css) {
    files['index.css'] = props.css
  }
  stackBlitz.openProject({
    title: props.title,
    description: props.description,
    template: 'javascript',
    dependencies: {
      'klinecharts': `${props.version || '^9.5.0'}`
    },
    files
  })
}

</script>

<template>
  <div class="chart sample-chart">
    <div id="container" class="chart-container">
    </div>
    <div class="code-action-container">
      <a target="_blank" href="">
        <Tooltip :tip="lang === 'zh-CN' ? '在 CodePen 中打开' : 'Open in CodePen'">
          <svg viewBox="0 0 1024 1024">
            <path d="M911.7 385.3l-0.3-1.5c-0.2-1-0.3-1.9-0.6-2.9-0.2-0.6-0.4-1.1-0.5-1.7-0.3-0.8-0.5-1.7-0.9-2.5-0.2-0.6-0.5-1.1-0.8-1.7-0.4-0.8-0.8-1.5-1.2-2.3-0.3-0.5-0.6-1.1-1-1.6-0.8-1.2-1.7-2.4-2.6-3.6-0.5-0.6-1.1-1.3-1.7-1.9-0.4-0.5-0.9-0.9-1.4-1.3-0.6-0.6-1.3-1.1-1.9-1.6-0.5-0.4-1-0.8-1.6-1.2-0.2-0.1-0.4-0.3-0.6-0.4L531.1 117.8c-11.5-7.7-26.6-7.7-38.1 0L127.3 361.3c-0.2 0.1-0.4 0.3-0.6 0.4-0.5 0.4-1 0.8-1.6 1.2-0.7 0.5-1.3 1.1-1.9 1.6-0.5 0.4-0.9 0.9-1.4 1.3-0.6 0.6-1.2 1.2-1.7 1.9-1 1.1-1.8 2.3-2.6 3.6-0.3 0.5-0.7 1-1 1.6-0.4 0.7-0.8 1.5-1.2 2.3-0.3 0.5-0.5 1.1-0.8 1.7-0.3 0.8-0.6 1.7-0.9 2.5-0.2 0.6-0.4 1.1-0.5 1.7-0.2 0.9-0.4 1.9-0.6 2.9l-0.3 1.5c-0.2 1.5-0.3 3-0.3 4.5v243.5c0 1.5 0.1 3 0.3 4.5l0.3 1.5c0.2 1 0.4 1.9 0.6 2.9 0.2 0.6 0.3 1.1 0.5 1.7 0.3 0.9 0.6 1.7 0.9 2.5 0.2 0.6 0.5 1.1 0.8 1.7 0.4 0.8 0.7 1.5 1.2 2.3 0.3 0.5 0.6 1.1 1 1.6 0.5 0.7 0.9 1.4 1.5 2.1l1.2 1.5c0.5 0.6 1.1 1.3 1.7 1.9 0.4 0.5 0.9 0.9 1.4 1.3 0.6 0.6 1.3 1.1 1.9 1.6 0.5 0.4 1 0.8 1.6 1.2 0.2 0.1 0.4 0.3 0.6 0.4L493 905.7c5.6 3.8 12.3 5.8 19.1 5.8 6.6 0 13.3-1.9 19.1-5.8l365.6-243.5c0.2-0.1 0.4-0.3 0.6-0.4 0.5-0.4 1-0.8 1.6-1.2 0.7-0.5 1.3-1.1 1.9-1.6 0.5-0.4 0.9-0.9 1.4-1.3 0.6-0.6 1.2-1.2 1.7-1.9l1.2-1.5 1.5-2.1c0.3-0.5 0.7-1 1-1.6 0.4-0.8 0.8-1.5 1.2-2.3 0.3-0.5 0.5-1.1 0.8-1.7 0.3-0.8 0.6-1.7 0.9-2.5 0.2-0.5 0.4-1.1 0.5-1.7 0.3-0.9 0.4-1.9 0.6-2.9l0.3-1.5c0.2-1.5 0.3-3 0.3-4.5V389.8c-0.3-1.5-0.4-3-0.6-4.5zM546.4 210.5l269.4 179.4-120.3 80.4-149-99.6V210.5z m-68.8 0v160.2l-149 99.6-120.3-80.4 269.3-179.4zM180.7 454.1l86 57.5-86 57.5v-115z m296.9 358.5L208.3 633.2l120.3-80.4 149 99.6v160.2zM512 592.8l-121.6-81.2L512 430.3l121.6 81.2L512 592.8z m34.4 219.8V652.4l149-99.6 120.3 80.4-269.3 179.4zM843.3 569l-86-57.5 86-57.5v115z" />
          </svg>
        </Tooltip>
      </a>
      <a>
        <Tooltip :tip="lang === 'zh-CN' ? '在 CodeSandbox 中打开' : 'Open in CodeSandbox'">
          <svg viewBox="0 0 1024 1024">
            <path d="M709.6 210l0.4-0.2h0.2L512 96 313.9 209.8h-0.2l0.7 0.3L151.5 304v416L512 928l360.5-208V304l-162.9-94zM482.7 843.6L339.6 761V621.4L210 547.8V372.9l272.7 157.3v313.4zM238.2 321.5l134.7-77.8 138.9 79.7 139.1-79.9 135.2 78-273.9 158-274-158zM814 548.3l-128.8 73.1v139.1l-143.9 83V530.4L814 373.1v175.2z" />
          </svg>
        </Tooltip>
      </a>
      <button
        @click="openStackBlitz()">
        <Tooltip :tip="lang === 'zh-CN' ? '在 StackBlitz 中打开' : 'Open in StackBlitz'">
          <svg viewBox="0 0 28 28">
            <path d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z"/>
          </svg>
        </Tooltip>
      </button>
      <a target="_blank" :href="href">
        <Tooltip :tip="lang === 'zh-CN' ? '在新窗口中打开' : 'Open in a new window'">
          <svg viewBox="0 0 1024 1024" style="width:16px;height:16px;">
            <path d="M256 256V149.333333c0-58.88 47.829333-106.666667 106.666667-106.666666h512c58.88 0 106.666667 47.829333 106.666666 106.666666v512c0 58.88-47.829333 106.666667-106.666666 106.666667h-106.666667v106.666667c0 58.88-47.829333 106.666667-106.666667 106.666666H149.333333c-58.88 0-106.666667-47.829333-106.666666-106.666666V362.666667c0-58.88 47.829333-106.666667 106.666666-106.666667h106.666667z m0 85.333333H149.333333c-11.733333 0-21.333333 9.6-21.333333 21.333334v512c0 11.733333 9.6 21.333333 21.333333 21.333333h512c11.733333 0 21.333333-9.6 21.333334-21.333333v-106.666667H362.666667c-58.88 0-106.666667-47.829333-106.666667-106.666667V341.333333z m85.333333-192v512c0 11.733333 9.6 21.333333 21.333334 21.333334h512c11.733333 0 21.333333-9.6 21.333333-21.333334V149.333333c0-11.733333-9.6-21.333333-21.333333-21.333333H362.666667c-11.733333 0-21.333333 9.6-21.333334 21.333333z" />
          </svg>
        </Tooltip>
      </a>
    </div>
  </div>
</template>

<style scoped>
  .chart {
    margin-top: 16px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border: solid 1px var(--vp-c-divider);
    border-bottom: none;
  }
  
  .chart-container {
    padding-bottom: 10px;
  }

  .code-action-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border-top: dashed 1px var(--vp-c-divider);
  }

  .code-action-container a, .code-action-container button {
    margin-right: 12px;
  }

  .code-action-container a:last-child {
    margin-right: 0;
  }
  .code-action-container a svg, .code-action-container button svg {
    width: 20px;
    height: 20px;
    fill: var(--vp-c-text-1);
    opacity: 0.7;
  }

  .code-action-container a svg:hover, .code-action-container button svg:hover {
    opacity: 1;
  }
</style>