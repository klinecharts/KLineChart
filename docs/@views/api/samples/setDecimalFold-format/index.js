import { init } from 'klinecharts'

const subscriptNumbers = {
  0: '₀',
  1: '₁',
  2: '₂',
  3: '₃',
  4: '₄',
  5: '₅',
  6: '₆',
  7: '₇',
  8: '₈',
  9: '₉'
}

const chart = init('setDecimalFold-format-chart')

chart.setDecimalFold({
  format: value => {
    const vl = `${value}`
    const reg = /\.0{3,}[1-9][0-9]*$/
    if (reg.test(vl)) {
      const result = vl.split('.')
      const lastIndex = result.length - 1
      const v = result[lastIndex]
      const match = /0*/.exec(v)
      if (match) {
        const count = `${match[0].length}`
        result[lastIndex] = v.replace(/0*/, `0${count.replace(/\d/, $1 => subscriptNumbers[$1] ?? '')}`)
        return result.join('.')
      }
    }
    return vl
  }
})

chart.setSymbol({ ticker: 'TestSymbol', pricePrecision: 10 })
chart.setPeriod({ span: 1, type: 'day' })
chart.setDataLoader({
  getBars: ({
    callback
  }) => {
    fetch('https://klinecharts.com/datas/kline2.json')
      .then(res => res.json())
      .then(dataList => {
        callback(dataList)
      })
  }
})
