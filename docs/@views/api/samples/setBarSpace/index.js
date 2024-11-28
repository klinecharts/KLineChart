import { init } from 'klinecharts';

const chart = init('setBarSpace-chart');
chart.setBarSpace(4);

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
