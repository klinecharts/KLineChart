import { init, registerXAxis } from 'klinecharts'

registerXAxis({
  name: 'customXAxis',
  createTicks: ({ defaultTicks }) => {
    return defaultTicks.map(({ coord, value }) => {
      const date = new Date(value)
      const year = date.getFullYear()
      const month = `${date.getMonth() + 1}`.padStart(2, '0')
      const day = `${date.getDate()}`.padStart(2, '0')
      return {
        coord,
        value,
        text: `${day}/${month}/${year}`
      }
    })
  }
})

const chart = init(
  'custom-x-axis-chart',
  {
    layout: [
      {
        type: 'xAxis',
        options: {
          order: 1000,
          axis: {
            name: 'customXAxis'
          }
        }
      }
    ]
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
