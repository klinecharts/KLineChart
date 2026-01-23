import { init } from 'klinecharts'

const chart = init('createOverlay-brush-chart')

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

function createBrushOverlay () {
  chart.createOverlay({
    name: 'brush',
    onDrawEnd: () => {
      // Automatically create a new brush overlay after drawing is complete
      createBrushOverlay()
    }
  })
}

// Initialize the first brush overlay
createBrushOverlay()
