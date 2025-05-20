import { init } from 'klinecharts'

const chart = init('setPaneOptions-axis-extension-chart')
chart.createIndicator('MACD')

chart.setPaneOptions({
  id: 'candle_pane',
  axis: {
    createTicks: ({ defaultTicks }) => {
      return defaultTicks.map(
        ({ coord, value, text }) => ({ coord, value, text: `$${text}` })
      )
    }
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
