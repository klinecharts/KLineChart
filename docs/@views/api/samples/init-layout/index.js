import { init } from 'klinecharts'

const chart = init('init-layout-chart', {
  layout: [
    {
      type: 'candle',
      content: ['MA', { name: 'EMA', calcParams: [10, 30] }],
      options: { order: Number.MIN_SAFE_INTEGER }
    },
    { type: 'indicator', content: ['VOL'], options: { order: 10 } },
    { type: 'xAxis', options: { order: 9 } }
  ]
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
