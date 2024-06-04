<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue'
import { useData } from 'vitepress';

import stackBlitz from '@stackblitz/sdk'
import { getParameters } from 'codesandbox/lib/api/define'

import { transform } from '@babel/standalone'

import ResizeObserver from 'resize-observer-polyfill'

const { isDark, lang } = useData()

import Tooltip from '../Tooltip.vue'
import Loading from '../Loading.vue'

const href = ref()

const props = defineProps(['js', 'css', 'html', 'title', 'description'])

const version = ref('9.5.0')
const loading = ref(true)

let observer

onMounted(() => {
  href.value = location.href
  loading.value = true
  const container = document.getElementById('container')
  const coreScript = document.createElement('script')
  coreScript.defer = true
  coreScript.src = 'https://unpkg.com/klinecharts/dist/umd/klinecharts.min.js'
  coreScript.onload = () => {
    const klinecharts = window.klinecharts
    if (klinecharts) {
      version.value = klinecharts.version()
      
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
        const script = document.createElement('script')
        script.innerHTML = code
        container.appendChild(script)
        window.chart.setStyles(isDark.value ? 'dark' : 'light')

        observer = new ResizeObserver(entries => {
          window.chart.resize()
        })
        observer.observe(container)
      }
      loading.value = false
    }
  }
  container.appendChild(coreScript)
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

function openStackBlitz () {
  const files = {
    'index.js': props.js,
    'index.html': props.html,
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
  const js = props.js
  const parameters = {
    title: `${props.title} - klinecharts@${version.value}`,
    description: props.description,
    html: props.html,
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
      content: props.js,
    },
    'index.html': {
      content: props.html,
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

</script>

<template>
  <div class="chart sample-chart">
    <div id="container" class="chart-container">
      <Loading v-if="loading"/>
    </div>
    <div class="code-action-container">
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
            <svg width="14" height="16" viewBox="0 0 14 16">
              <path d="M10.8369,2.19231L10.8447,2.18846L10.8485,2.18846L7,0L3.1534,2.18846L3.14951,2.18846L3.16311,2.19423L0,4L0,12L7,16L14,12L14,4L10.8369,2.19231ZM6.43107,14.3769L3.65243,12.7885L3.65243,10.1038L1.13592,8.68846L1.13592,5.325L6.43107,8.35L6.43107,14.3769ZM1.6835,4.33654L4.29903,2.84038L6.99612,4.37308L9.69709,2.83654L12.3223,4.33654L7.00389,7.375L1.6835,4.33654ZM12.8641,8.69808L10.3631,10.1038L10.3631,12.7788L7.56893,14.375L7.56893,8.35385L12.8641,5.32885L12.8641,8.69808Z" />
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
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M15.988,5.46909L15.982,5.43907C15.978,5.41906,15.976,5.40104,15.97,5.38103C15.966,5.36902,15.962,5.35902,15.96,5.34701C15.954,5.331,15.95,5.31299,15.942,5.29698C15.938,5.28497,15.932,5.27496,15.926,5.26295C15.918,5.24694,15.91,5.23293,15.9021,5.21692C15.8961,5.20692,15.8901,5.19491,15.8821,5.1849C15.8661,5.16089,15.8481,5.13687,15.8301,5.11285C15.8201,5.10085,15.8081,5.08684,15.7961,5.07483C15.7881,5.06482,15.7781,5.05682,15.7681,5.04881C15.7561,5.03681,15.7421,5.0268,15.7301,5.01679C15.7201,5.00879,15.7101,5.00078,15.6982,4.99278C15.6942,4.99077,15.6902,4.98677,15.6862,4.98477L8.37981,0.115576C8.14993,-0.0385253,7.84808,-0.0385253,7.61819,0.115576L0.307846,4.98877C0.303848,4.99077,0.29985,4.99478,0.295852,4.99678C0.285857,5.00478,0.275862,5.01279,0.263868,5.02079C0.249875,5.0308,0.237881,5.04281,0.225887,5.05282C0.215892,5.06082,0.207896,5.07083,0.197901,5.07883C0.185907,5.09084,0.173913,5.10285,0.163918,5.11686C0.143928,5.13887,0.127936,5.16289,0.111944,5.1889C0.105947,5.19891,0.0979512,5.20892,0.0919542,5.22093C0.0839581,5.23494,0.0759621,5.25095,0.0679662,5.26696C0.0619691,5.27696,0.0579712,5.28897,0.0519741,5.30098C0.0459771,5.31699,0.0399802,5.335,0.0339831,5.35101C0.0299852,5.36302,0.0259871,5.37303,0.0239881,5.38503C0.0199902,5.40305,0.0159921,5.42306,0.0119941,5.44307L0.00599706,5.47309C0.00199912,5.50311,0,5.53313,0,5.56315L0,10.4363C0,10.4664,0.00199897,10.4964,0.00599706,10.5264L0.0119941,10.5564C0.0159921,10.5764,0.0199902,10.5945,0.0239881,10.6145C0.027986,10.6265,0.0299852,10.6365,0.0339831,10.6485C0.0399802,10.6665,0.0459771,10.6825,0.0519741,10.6985C0.0559721,10.7105,0.0619691,10.7205,0.0679662,10.7325C0.0759622,10.7486,0.0819592,10.7626,0.0919542,10.7786C0.0979512,10.7886,0.103948,10.8006,0.111944,10.8106C0.121939,10.8246,0.129935,10.8386,0.141929,10.8526L0.165917,10.8826C0.175912,10.8946,0.187906,10.9087,0.1999,10.9207C0.207896,10.9307,0.217891,10.9387,0.227886,10.9467C0.23988,10.9587,0.253873,10.9687,0.265867,10.9787C0.275862,10.9867,0.285857,10.9947,0.297851,11.0027C0.301849,11.0047,0.305847,11.0087,0.309845,11.0107L7.61819,15.8839C7.73014,15.96,7.86407,16,8,16C8.13194,16,8.26587,15.962,8.38181,15.8839L15.6902,11.0107C15.6942,11.0087,15.6982,11.0047,15.7022,11.0027C15.7121,10.9947,15.7221,10.9867,15.7341,10.9787C15.7481,10.9687,15.7601,10.9567,15.7721,10.9467C15.7821,10.9387,15.7901,10.9287,15.8001,10.9207C15.8121,10.9087,15.8241,10.8967,15.8341,10.8826L15.8581,10.8526L15.8881,10.8106C15.8941,10.8006,15.9021,10.7906,15.908,10.7786C15.916,10.7626,15.924,10.7486,15.932,10.7325C15.938,10.7225,15.942,10.7105,15.948,10.6985C15.954,10.6825,15.96,10.6645,15.966,10.6485C15.97,10.6385,15.974,10.6265,15.976,10.6145C15.982,10.5965,15.984,10.5764,15.988,10.5564L15.994,10.5264C15.998,10.4964,16,10.4664,16,10.4363L16,5.55915C15.994,5.52913,15.992,5.49911,15.988,5.46909ZM8.68566,1.97079L14.071,5.56115L11.6662,7.17021L8.68766,5.1769L8.68766,1.97079L8.68566,1.97079ZM7.31035,1.97079L7.31035,5.1769L4.33184,7.17021L1.92704,5.56115L7.31035,1.97079ZM1.37531,6.84599L3.09445,7.99675L1.37531,9.1475L1.37531,6.84599ZM7.31035,14.0207L1.92704,10.4303L4.33184,8.82129L7.31035,10.8146L7.31035,14.0207ZM7.998,9.62181L5.56722,7.99675L7.998,6.36968L10.4288,7.99475L7.998,9.62181ZM8.68566,14.0207L8.68566,10.8146L11.6642,8.82129L14.069,10.4303L8.68566,14.0207ZM14.6207,9.1455L12.9016,7.99475L14.6207,6.84399L14.6207,9.1455Z" />
            </svg>
          </Tooltip>
        </button>
      </form>
      <button
        @click="openStackBlitz()">
        <Tooltip :tip="lang === 'zh-CN' ? '在 StackBlitz 中打开' : 'Open in StackBlitz'">
          <svg width="12" height="16" viewBox="0 0 12 16">
            <path d="M5.13686,9.45472L0,9.45472L9.39094,0L6.86314,6.54528L12,6.54528L2.60837,16L5.13686,9.45472L5.13686,9.45472Z" />
          </svg>
        </Tooltip>
      </button>
      <a target="_blank" :href="href">
        <Tooltip :tip="lang === 'zh-CN' ? '在新窗口中打开' : 'Open in a new window'">
          <svg width="15" height="15" viewBox="0 0 16 16">
            <path d="M3.63636,3.63636L3.63636,1.81818C3.63636,0.814546,4.45164,3.90139e-7,5.45455,3.90139e-7L14.1818,3.90139e-7C15.1855,3.90139e-7,16,0.815273,16,1.81818L16,10.5455C16,11.5491,15.1847,12.3636,14.1818,12.3636L12.3636,12.3636L12.3636,14.1818C12.3636,15.1855,11.5484,16,10.5455,16L1.81818,16C0.814546,16,3.90139e-7,15.1847,3.90139e-7,14.1818L3.90139e-7,5.45455C3.90139e-7,4.45091,0.815273,3.63636,1.81818,3.63636L3.63636,3.63636ZM3.63636,5.09091L1.81818,5.09091C1.61818,5.09091,1.45455,5.25455,1.45455,5.45455L1.45455,14.1818C1.45455,14.3818,1.61818,14.5455,1.81818,14.5455L10.5455,14.5455C10.7455,14.5455,10.9091,14.3818,10.9091,14.1818L10.9091,12.3636L5.45455,12.3636C4.45091,12.3636,3.63636,11.5484,3.63636,10.5455L3.63636,5.09091ZM5.09091,1.81818L5.09091,10.5455C5.09091,10.7455,5.25455,10.9091,5.45455,10.9091L14.1818,10.9091C14.3818,10.9091,14.5455,10.7455,14.5455,10.5455L14.5455,1.81818C14.5455,1.61818,14.3818,1.45455,14.1818,1.45455L5.45455,1.45455C5.25455,1.45455,5.09091,1.61818,5.09091,1.81818Z" />
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
    min-height: 400px;
    position: relative;
  }

  .code-action-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border-top: dashed 1px var(--vp-c-divider);
  }

  .code-action-container form {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .code-action-container a, .code-action-container button {
    padding: 0 8px;
  }

  .code-action-container a:last-child {
    margin-right: 0;
  }
  .code-action-container a svg, .code-action-container button svg {
    fill: var(--vp-c-text-1);
    opacity: 0.68;
    transform: scale(1);
    transition: opacity linear .2s, transform linear .2s;
  }

  .code-action-container a svg:hover, .code-action-container button svg:hover {
    opacity: 1;
    transform: scale(1.2);
  }
</style>