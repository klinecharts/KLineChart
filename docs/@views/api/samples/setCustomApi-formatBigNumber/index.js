import { init } from 'klinecharts';

const chart = init('setCustomApi-formatBigNumber-chart');
chart.setCustomApi({
  formatBigNumber: value => {
    const v = +value
    if (typeof v === 'number') {
      if (v > 10000) {
        return `${+((v / 10000).toFixed(3))}万`
      }
    }
    return `${value}`
  }
})
chart.createIndicator('VOL')

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
