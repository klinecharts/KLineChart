import { init } from 'klinecharts';

const chart = init(
  'init-thousandsSeparator-none-chart',
  { thousandsSeparator: { sign: '' } }
)

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
