import { init } from 'klinecharts'

const chart = init(
  'init-formatBigNumber-chart',
  {
    formatter: {
      formatBigNumber: value => {
        const v = +value
        if (typeof v === 'number') {
          if (v > 10000) {
            return `${+((v / 10000).toFixed(3))}万`
          }
        }
        return `${value}`
      }
    }
  }
)
chart.createIndicator('VOL')

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
