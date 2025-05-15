import { init } from 'klinecharts'

const chart = init('setPaneOptions-axis-basic-chart')
chart.createIndicator('MACD')

chart.setPaneOptions({
  id: 'candle_pane',
  axis: {
    name: 'logarithm',
    reverse: true
  }
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
