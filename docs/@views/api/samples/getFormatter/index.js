import { init } from 'klinecharts'

const chart = init('getFormatter-chart')

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList) })

const formatter = chart.getFormatter()
console.log(formatter)
