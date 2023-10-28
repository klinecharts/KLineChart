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
  chart = init('tooltip-chart')
  chart.createIndicator('MA', false, { id: 'candle_pane' })
  chart.createIndicator('VOL')
  chart.applyNewData(genData())
  chart.setStyles(isDark.value ? 'dark' : 'light')
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  dispose('tooltip-chart')
})

watch(isDark, (newValue) => {
  if (newValue) {
    chart.setStyles('dark')
  } else {
    chart.setStyles('light')
  }
})

function setCandleTooltipShowRule (showRule) {
  chart.setStyles({
    candle: {
      tooltip: {
        showRule
      }
    }
  })
}

function setCandleTooltipShowType (showType) {
  chart.setStyles({
    candle: {
      tooltip: {
        showType
      }
    }
  })
}

function setIndicatorTooltipShowRule (showRule) {
  chart.setStyles({
    indicator: {
      tooltip: {
        showRule
      }
    }
  })
}

function setIndicatorTooltipShowType (showType) {
  chart.setStyles({
    indicator: {
      tooltip: {
        showType
      }
    }
  })
}

</script>

<template>
  <Container>
    <div class="button-box">
      <span>{{ lang === 'zh-CN' ? '基础信息提示：' : 'Base tooltip: ' }}</span>
      <button @click="setCandleTooltipShowRule('always')">{{ lang === 'zh-CN' ? '总是显示' : 'Always' }}</button>
      <button @click="setCandleTooltipShowRule('follow_cross')">{{ lang === 'zh-CN' ? '跟随十字光标' : 'Follow Cross' }}</button>
      <button @click="setCandleTooltipShowRule('none')">{{ lang === 'zh-CN' ? '不显示' : 'Hide' }}</button>
      <button @click="setCandleTooltipShowType('standard')">{{ lang === 'zh-CN' ? '默认' : 'Standard' }}</button>
      <button @click="setCandleTooltipShowType('rect')">{{ lang === 'zh-CN' ? '矩形框' : 'Rect' }}</button>
    </div>
    <div class="button-box">
      <span>{{ lang === 'zh-CN' ? '指标信息提示：' : 'Indicator tooltip: ' }}</span>
      <button @click="setIndicatorTooltipShowRule('always')">{{ lang === 'zh-CN' ? '总是显示' : 'Always' }}</button>
      <button @click="setIndicatorTooltipShowRule('follow_cross')">{{ lang === 'zh-CN' ? '跟随十字光标' : 'Follow Cross' }}</button>
      <button @click="setIndicatorTooltipShowRule('none')">{{ lang === 'zh-CN' ? '不显示' : 'Hide' }}</button>
      <button @click="setIndicatorTooltipShowType('standard')">{{ lang === 'zh-CN' ? '默认' : 'Standard' }}</button>
      <button @click="setIndicatorTooltipShowType('rect')">{{ lang === 'zh-CN' ? '矩形框' : 'Rect' }}</button>
    </div>
    <div id="tooltip-chart" style="height:450px;"/>
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