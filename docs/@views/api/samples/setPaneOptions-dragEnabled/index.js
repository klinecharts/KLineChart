import { init } from 'klinecharts'

const chart = init('setPaneOptions-dragEnabled-chart')
const paneId = 'macd_pane'
chart.createIndicator('MACD', { pane: { id: paneId } })

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
