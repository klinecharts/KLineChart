import { init } from 'klinecharts'

const chart = init('overrideXAxis-chart')

chart.overrideXAxis({
  scrollZoomEnabled: false,
  createTicks: ({ defaultTicks }) => {
    return defaultTicks.map(
      ({ coord, value, text }) => ({ coord, value, text: `T ${text}` })
    )
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
