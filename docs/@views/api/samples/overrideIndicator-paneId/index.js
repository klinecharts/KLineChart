import { init } from 'klinecharts'

const chart = init('overrideIndicator-paneId-chart')
chart.createIndicator('MA', { pane: { id: 'candle_pane' } })
chart.createIndicator('MA')
chart.overrideIndicator({
  paneId: 'candle_pane',
  name: 'MA',
  shouldOhlc: false,
  precision: 1,
  calcParams: [10, 30],
  styles: {
    lines: [
      { color: '#8fd3e8' },
      { color: '#edafda' }
    ]
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
