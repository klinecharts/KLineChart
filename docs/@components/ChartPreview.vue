<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress';

import { codeToHtml } from 'shiki'

import { transform } from '@babel/standalone'
import ResizeObserver from 'resize-observer-polyfill'

import stackBlitz from '@stackblitz/sdk'
import { getParameters } from 'codesandbox/lib/api/define'

import Tooltip from './Tooltip.vue';

const { isDark, lang } = useData()

import Loading from './Loading.vue'

const href = ref()

const props = defineProps(['title', 'chartId', 'chartHeight', 'code'])

const loading = ref(true)

const showCode = ref(!props.chartId)

const chartContainer = ref(null)

const observer = ref(null)
const codeHtml = ref(null)

const copied = ref(false)

const version = ref(window.klinecharts.version())

function openStackBlitz () {
  const files = {
    'index.js': props.code,
    'index.html': `<div id="${props.chartId}" style="height: 400px"/>`,
  }
  if (props.css) {
    files['index.css'] = props.css
  }
  stackBlitz.openProject({
    title: `${props.title} - klinecharts@${version.value}`,
    description: props.description,
    template: 'javascript',
    dependencies: {
      'klinecharts': version.value
    },
    files
  })
}

function getCodePenParameters () {
  const js = props.code
  const parameters = {
    title: `${props.title} - klinecharts@${version.value}`,
    description: props.description,
    html: `<div id="${props.chartId}" style="height: 400px"/>`,
    js: js.replace(/import\s+{(\s+[^}]*\s+)}\s+from\s+'klinecharts'/, 'const {$1} = klinecharts').replace(/import.*\'\.\/index\.css\'/, ''),
    js_external: `https://unpkg.com/klinecharts@${version.value}/dist/klinecharts.min.js`
  }
  if (props.css) {
    parameters.css = props.css
  }
  return JSON.stringify(parameters)
}

function getCodeSandboxParameters () {
  const files = {
    'index.js': {
      content: props.code,
    },
    'index.html': {
      content: `<div id="${props.chartId}" style="height: 400px"/>`,
    },
    'index.css': {
      content: props.css
    },
    'package.json': {
      content: {
        title: `${props.title} - klinecharts@${version.value}`,
        dependencies: {
          klinecharts: version.value
        }
      },
    },
  }
  if (props.css) {
    files['index.css'] = { content: props.css }
  }
  return getParameters({ files })
}

async function copyHandler () {
  copied.value = true
  const text = props.code
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const element = document.createElement('textarea')
    const previouslyFocusedElement = document.activeElement

    element.value = text

    element.setAttribute('readonly', '')

    element.style.contain = 'strict'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.fontSize = '12pt' // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection
      ? selection.rangeCount > 0 && selection.getRangeAt(0)
      : null

    document.body.appendChild(element)
    element.select()

    element.selectionStart = 0
    element.selectionEnd = text.length

    document.execCommand('copy')
    document.body.removeChild(element)

    if (originalRange) {
      selection.removeAllRanges()
      selection.addRange(originalRange)
    }

    if (previouslyFocusedElement) {
      ;(previouslyFocusedElement).focus()
    }
  }
  setTimeout(() => {
    copied.value = false
  }, 3000)
}

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
    if (!!props.chartId) {
      const transformJs = props.code + '\n' + `window['chart_${props.chartId}'] = chart`
      const { code } = transform(transformJs, {
        presets: [
          'es2015',
          ['stage-3', { decoratorsBeforeExport: true }],
        ],
        plugins: ['transform-modules-umd'],
      })
      const chartDom = document.createElement('div')
      chartDom.style.height = `${props.chartHeight || 350}px`
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
  if (!!props.chartId) {
    if (newValue) {
    window[`chart_${props.chartId}`].setStyles('dark')
    } else {
      window[`chart_${props.chartId}`].setStyles('light')
    }
  }
})

onUnmounted(() => {
  if (!!props.chartId) {
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
  <template v-if="!!props.chartId">
    <div
      ref="chartContainer"
      class="content-item chart">
      <Loading v-if="loading"/>
    </div>
    <div
      class="code-action-container"
      :class="{ 'hiddenCode': !showCode }">
      <form
        action="https://codesandbox.io/api/v1/sandboxes/define"
        method="POST"
        target="_blank">
        <input
          type="hidden"
          name="parameters"
          :value="getCodeSandboxParameters()"/>
        <button type="submit">
          <Tooltip :tip="lang === 'zh-CN' ? '在 CodeSandbox 中打开' : 'Open in CodeSandbox'">
            <svg width="18px" height="18px" viewBox="0 0 24 24">
              <path stroke="none" d="M2.34 6.423L12 .845l9.66 5.578v11.154L12 23.155l-9.66-5.578zM12 3.155L9.67 4.5L12 5.845L14.33 4.5zm4.33 2.5L12 8.155l-4.33-2.5L5.34 7L12 10.845L18.66 7zm3.33 3.077L13 12.577v7.69l2.34-1.35v-4.994l4.32-2.495zm0 5.006l-2.32 1.34v2.684l2.32-1.34zm-15.32-2.31l4.32 2.495v4.994l2.34 1.35v-7.69L4.34 8.732zm0 2.31v2.685l2.32 1.34v-2.686z"/>
            </svg>
          </Tooltip>
        </button>
      </form>
      <form
        action="https://codepen.io/pen/define"
        method="POST"
        target="_blank">
        <input
          type="hidden"
          name="data"
          :value="getCodePenParameters()"/>
        <button type="submit">
          <Tooltip :tip="lang === 'zh-CN' ? '在 CodePen 中打开' : 'Open in CodePen'">
            <svg width="20px" height="20px" viewBox="0 0 24 24"><path stroke="none" d="m21.66 8.264l-9.18-6.12a.88.88 0 0 0-.966 0l-9.146 6.12c-.225.129-.354.451-.354.676v6.087c0 .258.129.548.354.741l9.147 6.087a.88.88 0 0 0 .966 0l9.146-6.087c.226-.129.355-.45.355-.74V8.94c.032-.257-.097-.547-.323-.676m-8.793-3.8l6.731 4.509l-3.06 1.996l-3.703-2.512c.032 0 .032-3.993.032-3.993m-1.707 0v3.993L7.424 10.97L4.43 8.973zM3.753 10.55L5.878 12l-2.125 1.45zm7.407 8.985l-6.73-4.509l2.994-1.996l3.736 2.512zm.87-5.475L8.97 12l3.06-2.061L15.09 12zm.837 5.475v-3.993l3.736-2.512l2.995 1.996zm7.407-6.087L18.15 12l2.125-1.45z"/></svg>
          </Tooltip>
        </button>
      </form>
      <button
        @click="openStackBlitz()">
        <Tooltip :tip="lang === 'zh-CN' ? '在 StackBlitz 中打开' : 'Open in StackBlitz'">
          <svg width="18px" height="18px" viewBox="0 0 24 24">
            <path stroke="none" d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z"/>
          </svg>
        </Tooltip>
      </button>
      <button
        @click="showCode = !showCode">
        <Tooltip :tip="lang === 'zh-CN' ? (showCode ? '收起代码' : '显示代码') : (showCode ? 'Hide code' : 'Show code')">
          <svg v-if="!showCode" width="20px" height="20px" viewBox="0 0 16 16">
            <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.25 11.25L1.75 8l3.5-3.25m5.5 6.5L14.25 8l-3.5-3.25"/>
          </svg>
          <svg v-if="showCode" width="20px" height="20px" viewBox="0 0 16 16">
            <path stroke="none" fill-rule="evenodd" d="M10.218 3.216a.75.75 0 0 0-1.436-.431l-3 10a.75.75 0 0 0 1.436.43zM4.53 4.97a.75.75 0 0 1 0 1.06L2.56 8l1.97 1.97a.75.75 0 0 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 0m6.94 6.06a.75.75 0 0 1 0-1.06L13.44 8l-1.97-1.97a.75.75 0 0 1 1.06-1.06l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06 0" clip-rule="evenodd"/>
          </svg>
        </Tooltip>
      </button>
    </div>
  </template>
  <div
    v-if="showCode"
    class="content-item chart-preview-code">
    <button
      class="copy"
      :class="{ 'copied': copied }"
      @click="copyHandler()"/>
    <div v-html="codeHtml"/>
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

.content-item {
  width: 100%;
  box-sizing: border-box;
}

.chart {
  position: relative;
}

.code-action-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  border-top: solid 1px var(--vp-c-divider);
  border-bottom: solid 1px var(--vp-c-divider);
}

.code-action-container.hiddenCode {
  border-bottom: none;
}

.code-action-container form {
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-action-container a, .code-action-container button {
  padding: 0 6px;
}

.code-action-container a:last-child {
  margin-right: 0;
}
.code-action-container a svg, .code-action-container button svg {
  fill: var(--vp-c-text-1);
  stroke: var(--vp-c-text-1);
  opacity: 0.68;
  transform: scale(1);
  transition: opacity linear .2s, transform linear .2s;
}

.code-action-container a svg:hover, .code-action-container button svg:hover {
  opacity: 1;
  transform: scale(1.2);
}
</style>

<style>
.chart-preview-code {
  position: relative;
  overflow: auto;
  font-size: var(--vp-code-font-size);
}

.chart-preview-code button.copy {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  border: 1px solid var(--vp-code-copy-code-border-color);
  border-radius: 4px;
  width: 40px;
  height: 40px;
  background-color: var(--vp-code-copy-code-bg);
  opacity: 0;
  cursor: pointer;
  background-image: var(--vp-icon-copy);
  background-position: 50%;
  background-size: 20px;
  background-repeat: no-repeat;
  transition: border-color 0.25s, background-color 0.25s, opacity 0.25s;
}

.chart-preview-code:hover button.copy {
  opacity: 1;
}

.chart-preview-code button.copy.copied {
  background-image: var(--vp-icon-copied);
}

.chart-preview-code button.copy.copied::before,
.chart-preview-code button.copy:hover.copied::before {
  position: relative;
  top: -1px;
  /*rtl:ignore*/
  transform: translateX(calc(-100% - 1px));
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--vp-code-copy-code-hover-border-color);
  /*rtl:ignore*/
  border-right: 0;
  border-radius: 4px 0 0 4px;
  padding: 0 10px;
  width: fit-content;
  height: 40px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-code-copy-code-active-text);
  background-color: var(--vp-code-copy-code-hover-bg);
  white-space: nowrap;
  content: var(--vp-code-copy-copied-text-content);
}

.chart-preview-code button.copy:hover, .chart-preview-code button.copy.copied {
  border-color: var(--vp-code-copy-code-hover-border-color);
  background-color: var(--vp-code-copy-code-hover-bg);
}

.chart-preview-code .shiki {
  margin: 0;
  background-color: transparent!important;
}

.chart-preview-code .shiki code {
  display: block;
  padding: 24px;
  width: fit-content;
  min-width: 100%;
}

html.dark .chart-preview-code .shiki code span {
  color: var(--shiki-dark) !important;
}
</style>