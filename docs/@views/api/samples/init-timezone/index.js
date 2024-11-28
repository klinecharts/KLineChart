import { init } from 'klinecharts';

const chart = init(
  'init-timezone-chart',
  { timezone: 'Europe/Berlin' }
)

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
