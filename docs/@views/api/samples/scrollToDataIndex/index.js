import { init } from 'klinecharts'

const chart = init('scrollToDataIndex-chart')

chart.setSymbol({ ticker: 'TestSymbol' })
chart.setPeriod({ span: 1, type: 'day' })
chart.setDataLoader({
  getBars: ({
    callback
  }) => {
    fetch('https://klinecharts.com/datas/kline.json')
      .then(res => res.json())
      .then(dataList => {
        callback(dataList)
      })
  }
})

setTimeout(() => {
  chart.scrollToDataIndex(chart.getDataList().length - 100, 200)
}, 5000)
