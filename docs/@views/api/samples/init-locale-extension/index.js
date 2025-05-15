import { init, registerLocale } from 'klinecharts'

registerLocale('zh-TW', {
  time: '時間：',
  open: '開：',
  high: '高：',
  low: '低：',
  close: '收：',
  volume: '量：',
  second: '秒',
  minute: '分鐘',
  hour: '小時',
  day: '天',
  week: '週',
  month: '月',
  year: '年'
})

const chart = init(
  'init-locale-extension-chart',
  { locale: 'zh-TW' }
)

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
