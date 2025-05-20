import { init, registerIndicator } from 'klinecharts'

registerIndicator({
  name: 'customIndicatorBasic',
  shortName: 'Basic',
  series: 'price',
  figures: [{
    key: 'close',
    title: 'close: ',
    type: 'line'
  }],
  calc: dataList => dataList.map(data => ({ close: data.close }))
})

const chart = init('custom-indicator-basic-chart')

chart.createIndicator('customIndicatorBasic')

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
