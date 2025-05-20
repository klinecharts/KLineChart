import { init } from 'klinecharts'

const chart = init(
  'init-thousandsSeparator-format-chart',
  {
    thousandsSeparator: {
      format: value => {
        const sign = '.'
        const v = `${value}`
        if (v.includes('.')) {
          const arr = v.split('.')
          return `${arr[0].replace(/(\d)(?=(\d{3})+$)/g, $1 => `${$1}${sign}`)},${arr[1]}`
        }
        return v.replace(/(\d)(?=(\d{3})+$)/g, $1 => `${$1}${sign}`)
      }
    }
  }
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
