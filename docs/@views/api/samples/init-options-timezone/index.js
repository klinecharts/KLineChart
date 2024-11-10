import { init } from 'klinecharts';

const chart = init(
  'init-options-timezone-chart',
  { timezone: 'Europe/Berlin' }
)

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
