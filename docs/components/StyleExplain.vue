<script setup>
import { ref } from 'vue'

const items = ref([
  'grid.horizontal', 'grid.vertical', 'candle.bar',
  'candle.candle.priceMark.last.line', 'candle.candle.priceMark.last.text',
  'candle.candle.priceMark.high', 'candle.candle.priceMark.low', 'candle.candle.tooltip',
  'indicator.ohlc', 'indicator.lastValueMark', 'indicator.tooltip',
  'xAxis.axisLine', 'xAxis.tickLine', 'xAxis.tickText',
  'yAxis.axisLine', 'yAxis.tickLine', 'yAxis.tickText',
  'separator', 'crosshair.horizontal.line', 'crosshair.horizontal.text',
  'crosshair.vertical.line', 'crosshair.vertical.text', 'overlay'
])
</script>

<template>
  <img src="/images/style.jpg"/>
  <div class="style-explain">
    <span class="style-explain-item" v-for="(item, i) in items">
      <strong>{{ i + 1 }}</strong>
      {{ item }}
    </span>
  </div>
</template>

<style scoped>
  .style-explain {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .style-explain-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 30px;
    margin-top: 2px;
  }

  .style-explain-item strong {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: red;
    width: 18px;
    height: 18px;
    margin-right: 4px;
    font-size: 12px;
    border-radius: 9px;
    color: #ffffff
  }
</style>

