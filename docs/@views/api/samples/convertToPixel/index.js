import { init } from 'klinecharts'

const chart = init('convertToPixel-chart')

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
        const data = dataList[dataList.length - 20]
        const coordinates = chart.convertToPixel(
          [{ timestamp: data.timestamp, value: data.high }],
          { paneId: 'candle_pane', absolute: false }
        )
      })
  }
})
