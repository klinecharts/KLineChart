import { init } from 'klinecharts'

const chart = init('executeAction-chart')

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
        chart.executeAction(
          'onCrosshairChange',
          { x: 200, y: 200, paneId: 'candle_pane' }
        )
      })
  }
})
