import { init, registerOverlay } from 'klinecharts'

registerOverlay({
  name: 'customOverlayBasic',
  totalStep: 2,
  createPointFigures: ({ coordinates }) => {
    return {
      type: 'rect',
      attrs: {
        x: coordinates[0].x,
        y: coordinates[0].y,
        width: 50,
        height: 50
      }
    }
  }
})

const chart = init('custom-overlay-basic-chart')

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
        const data = dataList[dataList.length - 10]
        chart.createOverlay({
          name: 'customOverlayBasic',
          points: [{ timestamp: data.timestamp, value: data.close }]
        })
      })
  }
})
