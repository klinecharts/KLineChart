import { init } from 'klinecharts'

const chart = init('setZoomBehavior-chart')

chart.setZoomBehavior({ main: 'last_bar', xAxis: 'cursor_point' })

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
