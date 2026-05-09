import { init } from 'klinecharts'

const chart = init('createIndicator-paneOptions-basic-chart')
chart.createIndicator({ name: 'VOL', paneId: 'vol_pane' })
chart.setPaneOptions({ id: 'vol_pane', height: 200, dragEnabled: false })

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
