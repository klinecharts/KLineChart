import { init } from 'klinecharts';

const chart = init('setBarSpace-chart');
chart.setBarSpace(4);

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
