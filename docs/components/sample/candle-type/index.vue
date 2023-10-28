<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

import { init, dispose } from '../../../../src/index'

import Container from '../Container.vue'
import genData from '../genData'

const { isDark, lang } = useData()

let chart

const resizeHandler = () => {
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  chart = init('candle-type-chart')
  chart.applyNewData(genData())
  chart.setStyles(isDark.value ? 'dark' : 'light')
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  dispose('candle-type-chart')
})

watch(isDark, (newValue) => {
  if (newValue) {
    chart.setStyles('dark')
  } else {
    chart.setStyles('light')
  }
})

function setType (type) {
  chart.setStyles({
    candle: { type }
  })
}

</script>

<template>
  <Container>
    <div class="button-box">
      <button @click="setType('candle_solid')">{{ lang === 'zh-CN' ? '全实心' : 'All Solid' }}</button>
      <button @click="setType('candle_stroke')">{{ lang === 'zh-CN' ? '全空心' : 'All Stroke' }}</button>
      <button @click="setType('candle_up_stroke')">{{ lang === 'zh-CN' ? '涨空心' : 'Up Stroke' }}</button>
      <button @click="setType('candle_down_stroke')">{{ lang === 'zh-CN' ? '跌空心' : 'Down Stroke' }}</button>
      <button @click="setType('ohlc')">ohlc</button>
      <button @click="setType('area')">{{ lang === 'zh-CN' ? '面积图' : 'Area' }}</button>
    </div>
    <div id="candle-type-chart" style="height:450px;"/>
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
  outline: none;
}
</style>