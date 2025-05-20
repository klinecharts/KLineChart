import { init } from 'klinecharts'

const chart = init('removeOverlay-name-chart')
const paneId = chart.createIndicator({
  name: 'MA',
  calcParams: [5],
  shouldOhlc: false
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
        const startData = dataList[dataList.length - 50]
        const endData = dataList[dataList.length - 10]
        chart.createOverlay({
          name: 'segment',
          paneId: 'candle_pane',
          points: [
            { timestamp: startData.timestamp, value: startData.high },
            { timestamp: endData.timestamp, value: endData.low }
          ]
        })
        chart.createOverlay({
          name: 'priceLine',
          paneId: 'candle_pane',
          points: [
            { timestamp: startData.timestamp, value: endData.close }
          ]
        })
        chart.createOverlay({
          name: 'priceLine',
          paneId,
          points: [
            { timestamp: startData.timestamp, value: startData.high },
            { timestamp: endData.timestamp, value: endData.low }
          ]
        })

        chart.removeOverlay({ name: 'priceLine' })
      })
  }
})
