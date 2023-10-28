<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

import { init, dispose, registerIndicator } from '../../../../src/index'

import Container from '../Container.vue'
import genData from '../genData'

const { isDark, lang } = useData()

const fruits = [
  '🍏', '🍎', '🍐', '🍊', '🍋', '🍌',
  '🍉', '🍇', '🍓', '🍈', '🍒', '🍑',
  '🍍', '🥥', '🥝', '🥭', '🥑', '🍏'
]

registerIndicator({
  name: 'Custom',
  figures: [
    { key: 'emoji' }
  ],
  calc: (kLineDataList) => {
    return kLineDataList.map(kLineData => ({ emoji: kLineData.close, text: fruits[Math.floor(Math.random() * 17)] }))
  },
  draw: ({
    ctx,
    barSpace,
    visibleRange,
    indicator,
    xAxis,
    yAxis
  }) => {
    const { from, to } = visibleRange

    ctx.font = `${barSpace.gapBar}px Helvetica Neue`
    ctx.textAlign = 'center'
    const result = indicator.result
    for (let i = from; i < to; i++) {
      const data = result[i]
      const x = xAxis.convertToPixel(i)
      const y = yAxis.convertToPixel(data.emoji)
      ctx.fillText(data.text, x, y)
    }
    return false
  }
})

let chart

const resizeHandler = () => {
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  chart = init('indicator-chart')
  chart.applyNewData(genData())
  chart.setStyles(isDark.value ? 'dark' : 'light')
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  dispose('indicator-chart')
})

watch(isDark, (newValue) => {
  if (newValue) {
    chart.setStyles('dark')
  } else {
    chart.setStyles('light')
  }
})

function setMainIndicator(name) {
  chart.createIndicator(name, true, { id: 'candle_pane' })
}

function setSubIndicator(name) {
  chart.createIndicator(name)
}

</script>

<template>
  <Container>
    <div class="button-box">
      <span>{{ lang === 'zh-CN' ? '主图：' : 'Main: ' }}</span>
      <button @click="setMainIndicator('MA')">MA</button>
      <button @click="setMainIndicator('BOLL')">BOLL</button>
      <button @click="setMainIndicator('Custom')">Custom</button>
      <span style="padding-left: 10px;">{{ lang === 'zh-CN' ? '副图：' : 'Sub: ' }}</span>
      <button @click="setSubIndicator('VOL')">VOL</button>
      <button @click="setSubIndicator('MACD')">MACD</button>
      <button @click="setSubIndicator('Custom')">Custom</button>
    </div>
    <div id="indicator-chart" style="height:450px"/>
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