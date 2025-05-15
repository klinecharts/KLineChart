import { init } from 'klinecharts'

const chart = init('setPaneOptions-dragEnabled-chart')
const paneId = chart.createIndicator('MACD')

chart.setPaneOptions({
  id: paneId,
  dragEnabled: false
})

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
