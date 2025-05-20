import { init } from 'klinecharts'

const chart = init('zoomAtTimestamp-chart')

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
  const dataList = chart.getDataList()
  chart.zoomAtTimestamp(
    0.8,
    dataList[dataList.length - 50].timestamp,
    200
  )
}, 5000)
