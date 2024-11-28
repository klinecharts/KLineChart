import { init } from 'klinecharts';

const chart = init(
  'init-styles-built-in-chart',
  { styles: 'light' }
)

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
