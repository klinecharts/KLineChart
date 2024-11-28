import { init } from 'klinecharts';

const chart = init(
  'init-locale-built-in-chart',
  { locale: 'zh-CN' }
)

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
