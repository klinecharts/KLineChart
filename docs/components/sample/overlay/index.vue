<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

import { init, dispose, registerOverlay } from '../../../../src/index'

import Container from '../Container.vue'
import genData from '../genData'

const { isDark, lang } = useData()

registerOverlay({
  name: 'circle',
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  totalStep: 3,
  createPointFigures: ({ coordinates }) => {
    if (coordinates.length === 2) {
      const xDis = Math.abs(coordinates[0].x - coordinates[1].x)
      const yDis = Math.abs(coordinates[0].y - coordinates[1].y)
      const radius = Math.sqrt(xDis * xDis + yDis * yDis)
      return {
        key: 'circle',
        type: 'circle',
        attrs: {
          ...coordinates[0],
          r: radius
        },
        styles: {
          style: 'stroke_fill'
        }
      }
    }
    return []
  }
})

let chart

const resizeHandler = () => {
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  chart = init('overlay-chart')
  chart.applyNewData(genData())
  chart.setStyles(isDark.value ? 'dark' : 'light')
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  dispose('overlay-chart')
})

watch(isDark, (newValue) => {
  if (newValue) {
    chart.setStyles('dark')
  } else {
    chart.setStyles('light')
  }
})

function createOverlay (name) {
  chart.createOverlay(name)
}

</script>

<template>
  <Container>
    <div class="button-box">
      <button @click="createOverlay('priceLine')">{{ lang === 'zh-CN' ? '价格线(内置)' : 'Price Line(Built-in)' }}</button>
      <button @click="createOverlay('circle')">{{ lang === 'zh-CN' ? '圆(自定义)' : 'Circle(Custom)' }}</button>
    </div>
    <div id="overlay-chart" style="height:450px"/>
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