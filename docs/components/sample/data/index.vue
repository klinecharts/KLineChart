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
  chart = init('data-chart')
  chart.loadMore((timestamp) => {
    loadMoreTimer = setTimeout(() => {
      chart.applyMoreData(genData(timestamp), true)
    }, 2000)
  })
  chart.applyNewData(genData(), true)
  updateData()
  chart.setStyles(isDark.value ? 'dark' : 'light')
  window.addEventListener('resize', resizeHandler)
})

function updateData () {
  setTimeout(() => {
    const dataList = chart.getDataList()
    const lastData = dataList[dataList.length - 1]
    const newData = { ...lastData }
    newData.close += (Math.random() * 20 - 10)
    newData.high = Math.max(newData.high, newData.close)
    newData.low = Math.min(newData.low, newData.close)
    newData.volume += Math.round(Math.random() * 10)
    chart.updateData(newData)
    updateData()
  }, 600)
}

watch(isDark, (newValue) => {
  if (newValue) {
    chart.setStyles('dark')
  } else {
    chart.setStyles('light')
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
  dispose('data-chart')
})
</script>

<template>
  <Container>
    <div id="data-chart" style="height:450px"/>
  </Container>
</template>
