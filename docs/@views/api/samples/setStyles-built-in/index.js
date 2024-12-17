import { init } from 'klinecharts';

const chart = init('setStyles-built-in-chart');
chart.setStyles('light');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });