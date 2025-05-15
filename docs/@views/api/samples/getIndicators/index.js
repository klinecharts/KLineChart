import { init } from 'klinecharts'

const chart = init('getIndicators-chart')
chart.createIndicator('MA', false, { id: 'candle_pane' })
chart.createIndicator('VOL')

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

const indicators = chart.getIndicators({
  paneId: 'candle_pane',
  name: 'MA'
})
