import { init } from 'klinecharts'

const chart = init('setPaneOptions-basic-chart')
const paneId = 'vol_pane'
chart.createIndicator('VOL', { pane: { id: paneId } })

chart.setPaneOptions({
  id: paneId,
  height: 160
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
