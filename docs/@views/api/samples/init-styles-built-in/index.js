import { init } from 'klinecharts';

const chart = init(
  'init-styles-built-in-chart',
  { styles: 'light' }
)

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
