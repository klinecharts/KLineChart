import { init } from 'klinecharts';

const chart = init('setLeftMinVisibleBarCount-chart');
chart.setLeftMinVisibleBarCount(6);

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
