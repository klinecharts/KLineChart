import { init } from 'klinecharts'

const chart = init('createIndicator-stack-chart')
chart.createIndicator('MA', false, { id: 'candle_pane' })
chart.createIndicator('EMA', true, { id: 'candle_pane' })

const id = chart.createIndicator('BOLL')
chart.createIndicator('EMA', true, { id })

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
