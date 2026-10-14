import { init } from 'klinecharts'

const colors = {
  strongUp: '#F92855',
  up: '#FF9600',
  flat: '#76808F',
  down: '#2DC08E',
  strongDown: '#1677FF'
}

function getCandleColor({ prev, current }) {
  if (!current) {
    return colors.flat
  }
  const comparePrice = prev?.close ?? current.open
  const changeRate = comparePrice === 0 ? 0 : (current.close - comparePrice) / comparePrice
  if (changeRate >= 0.02) {
    return colors.strongUp
  }
  if (changeRate > 0.005) {
    return colors.up
  }
  if (changeRate >= -0.005) {
    return colors.flat
  }
  if (changeRate > -0.02) {
    return colors.down
  }
  return colors.strongDown
}

const chart = init('setStyles-colorful-candle-chart')
chart.setStyles({
  candle: {
    bar: data => {
      const color = getCandleColor(data)
      return {
        color,
        borderColor: color,
        wickColor: color
      }
    },
    priceMark: {
      last: {
        line: {
          color: getCandleColor
        },
        text: {
          backgroundColor: getCandleColor
        }
      }
    }
  }
})

chart.setSymbol({ ticker: 'TestSymbol' })
chart.setPeriod({ span: 1, type: 'day' })
chart.setDataLoader({
  getBars: ({ callback }) => {
    fetch('https://klinecharts.com/datas/kline.json')
      .then(res => res.json())
      .then(dataList => {
        callback(dataList)
      })
  }
})
