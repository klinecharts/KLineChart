import { init } from 'klinecharts';

const chart = init(
  'init-options-customapi-chart',
  {
    customApi: {
      formatDate: (timestamp, _, type) => {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = `${date.getMonth() + 1}`.padStart(2, '0')
        const day = `${date.getDate()}`.padStart(2, '0')
        const hour = `${date.getHours()}`.padStart(2, '0')
        const minute = `${date.getMinutes()}`.padStart(2, '0')
        switch (type) {
          case 0: {
            return `${year}-${month}-${day} ${hour}-${minute}`
          }
          case 1: {
            return `${year}-${month}-${day}`
          }
          case 2: {
            return `${month}-${day}`
          }
        }
        return `${month}-${day} ${hour}-${minute}`
      },
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

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
