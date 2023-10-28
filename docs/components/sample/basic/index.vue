<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

import { init, dispose } from '../../../../src/index'

import Container from '../Container.vue'
import genData from '../genData'

const { isDark } = useData()

let chart

const resizeHandler = () => {
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  chart = init('basic-chart')
  chart.applyNewData(genData())
  chart.setStyles(isDark.value ? 'dark' : 'light')
  window.addEventListener('resize', resizeHandler)
})

watch(isDark, (newValue) => {
  if (newValue) {
    chart.setStyles('dark')
  } else {
    chart.setStyles('light')
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  dispose('basic-chart')
})
</script>

<template>
  <Container>
    <div id="basic-chart" style="height:450px"/>
  </Container>
</template>
