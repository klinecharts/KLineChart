import { init } from 'klinecharts'

const chart = init('zoomAtCoordinate-chart')

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

setTimeout(() => {
  chart.zoomAtCoordinate(0.8, { x: 150, y: 150 }, 200)
}, 5000)
