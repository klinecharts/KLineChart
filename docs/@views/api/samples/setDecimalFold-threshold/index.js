import { init } from 'klinecharts'

const chart = init('setDecimalFold-threshold-chart')

chart.setDecimalFold({ threshold: 1000 })

chart.setSymbol({ ticker: 'TestSymbol', pricePrecision: 10 })
chart.setPeriod({ span: 1, type: 'day' })
chart.setDataLoader({
  getBars: ({
    callback
  }) => {
    fetch('https://klinecharts.com/datas/kline2.json')
      .then(res => res.json())
      .then(dataList => {
        callback(dataList)
      })
  }
})
