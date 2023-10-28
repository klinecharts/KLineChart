<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

import { init, dispose, registerStyles } from '../../../../src/index'

import Container from '../Container.vue'
import genData from '../genData'

const { isDark, lang } = useData()

const red = '#F92855'
const green = '#2DC08E'

const alphaRed = 'rgba(249, 40, 85, .7)'
const alphaGreen = 'rgba(45, 192, 142, .7)'

registerStyles('green_rise_red_fall', {
  candle: {
    bar: {
      upColor: green,
      downColor: red,
      upBorderColor: green,
      downBorderColor: red,
      upWickColor: green,
      downWickColor: red
    },
    priceMark: {
      last: {
        upColor: green,
        downColor: red
      }
    }
  },
  indicator: {
    ohlc: {
      upColor: alphaGreen,
      downColor: alphaRed
    },
    bars: [{
      style: 'fill',
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaGreen,
      downColor: alphaRed,
      noChangeColor: '#888888'
    }],
    circles: [{
      style: 'fill',
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaGreen,
      downColor: alphaRed,
      noChangeColor: '#888888'
    }]
  }
})

registerStyles('red_rise_green_fall', {
  candle: {
    bar: {
      upColor: red,
      downColor: green,
      upBorderColor: red,
      downBorderColor: green,
      upWickColor: red,
      downWickColor: green,
    },
    priceMark: {
      last: {
        upColor: red,
        downColor: green,
      }
    }
  },
  indicator: {
    ohlc: {
      upColor: alphaRed,
      downColor: alphaGreen
    },
    bars: [{
      style: 'fill',
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaRed,
      downColor: alphaGreen,
      noChangeColor: '#888888'
    }],
    circles: [{
      style: 'fill',
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaRed,
      downColor: alphaGreen,
      noChangeColor: '#888888'
    }]
  }
})

let chart

const resizeHandler = () => {
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  chart = init('theme-chart')
  chart.createIndicator('VOL')
  chart.applyNewData(genData())
  chart.setStyles(isDark.value ? 'dark' : 'light')
  document.getElementById('theme-chart').style.backgroundColor = isDark.value ? '#1b1b1f' : '#ffffff'
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  dispose('theme-chart')
})

watch(isDark, (newValue) => {
  const chartElement = document.getElementById('theme-chart')
  if (newValue) {
    chart.setStyles('dark')
    chartElement.style.backgroundColor = '#1b1b1f'
  } else {
    chart.setStyles('light')
    chartElement.style.backgroundColor = '#ffffff'
  }
})

function setTheme (theme) {
  chart.setStyles(theme)
  if (theme === 'light') {
    document.getElementById('theme-chart').style.backgroundColor = '#ffffff'
  } else if (theme === 'dark') {
    document.getElementById('theme-chart').style.backgroundColor = '#1b1b1f'
  }
}

</script>

<template>
  <Container>
    <div class="button-box">
      <button @click="setTheme('light')">{{ lang === 'zh-CN' ? '浅色' : 'Light' }}</button>
      <button @click="setTheme('dark')">{{ lang === 'zh-CN' ? '深色' : 'Dark' }}</button>
      <button @click="setTheme('green_rise_red_fall')">{{ lang === 'zh-CN' ? '绿涨红跌' : 'Green rise and red fall' }}</button>
      <button @click="setTheme('red_rise_green_fall')">{{ lang === 'zh-CN' ? '红涨绿跌' : 'Red rise and green fall' }}</button>
    </div>
    <div id="theme-chart" style="height:450px"/>
  </Container>
</template>

<style scoped>
.button-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px;
}

.button-box button {
  padding: 2px 6px;
  background-color: #1677FF;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}

</style>