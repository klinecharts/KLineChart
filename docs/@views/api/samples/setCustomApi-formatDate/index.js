import { init } from 'klinecharts';

const chart = init('setCustomApi-formatDate-chart')

chart.setCustomApi({
  formatDate: (timestamp, _, type) => {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')
    const hour = `${date.getHours()}`.padStart(2, '0')
    const minute = `${date.getMinutes()}`.padStart(2, '0')
    switch (type) {
      case 0: {
        return `${year}-${month}-${day} ${hour}:${minute}`
      }
      case 1: {
        return `${year}-${month}-${day}`
      }
      case 2: {
        return `${month}-${day}`
      }
    }
    return `${month}-${day} ${hour}-${minute}`
  }
})

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
