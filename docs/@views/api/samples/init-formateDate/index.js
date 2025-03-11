import { init, utils } from 'klinecharts'

const chart = init(
  'init-formatDate-chart',
  {
    customApi: {
      formatDate: ({
        dateTimeFormat,
        timestamp,
        type
      }) => {
        switch (type) {
          case 'tooltip': {
            return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
          }
          case 'crosshair': {
            return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
          }
          case 'xAxis': {
            return utils.formatDate(dateTimeFormat, timestamp, 'MM-DD')
          }
        }
        return utils.formatDate(dateTimeFormat, timestamp, 'MM-DD HH:mm')
      }
    }
  }
)

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList) })
