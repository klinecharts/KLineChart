import { init } from 'klinecharts'

const chart = init('setPaneOptions-state-chart')
chart.createIndicator('MACD')

chart.setPaneOptions({
  id: 'candle_pane',
  state: 'minimize'
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
