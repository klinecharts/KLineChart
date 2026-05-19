import { init } from 'klinecharts'

const chart = init('createIndicator-stack-chart')
chart.createIndicator('MA', { pane: { id: 'candle_pane' } })
chart.createIndicator('EMA', { isStack: true, pane: { id: 'candle_pane' } })

const paneId = 'boll_pane'
chart.createIndicator('BOLL', { pane: { id: paneId } })
chart.createIndicator('EMA', { isStack: true, pane: { id: paneId } })

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
