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
  chart = init('axis-chart')
  chart.applyNewData(genData())
  chart.setStyles(isDark.value ? 'dark' : 'light')
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  dispose('axis-chart')
})

watch(isDark, (newValue) => {
  if (newValue) {
    chart.setStyles('dark')
  } else {
    chart.setStyles('light')
  }
})

function setPosition (position) {
  chart.setStyles({
    yAxis: {
      position
    }
  })
}

function setInside (inside) {
  chart.setStyles({
    yAxis: {
      inside
    }
  })
}

function setType (type) {
  chart.setStyles({
    yAxis: {
      type
    }
  })
}

function setReverse (reverse) {
  chart.setStyles({
    yAxis: {
      reverse
    }
  })
}

</script>

<template>
  <Container>
    <div class="button-box">
      <button @click="setPosition('right')">{{ lang === 'zh-CN' ? '右侧' : 'Right' }}</button>
      <button @click="setPosition('left')">{{ lang === 'zh-CN' ? '左侧' : 'Left' }}</button>
      <button @click="setInside(false)">{{ lang === 'zh-CN' ? '外部' : 'Inside' }}</button>
      <button @click="setInside(true)">{{ lang === 'zh-CN' ? '内部' : 'Outside' }}</button>
      <button @click="setType('normal')">{{ lang === 'zh-CN' ? '线性坐标' : 'Linear' }}</button>
      <button @click="setType('percentage')">{{ lang === 'zh-CN' ? '百分比坐标' : 'Percentage' }}</button>
      <button @click="setType('log')">{{ lang === 'zh-CN' ? '对数坐标' : 'Logarithm' }}</button>
      <button @click="setReverse(false)">{{ lang === 'zh-CN' ? '正向' : 'Regularity' }}</button>
      <button @click="setReverse(true)">{{ lang === 'zh-CN' ? '反向' : 'Reverse' }}</button>
    </div>
    <div id="axis-chart" style="height:450px;"/>
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