import { init } from 'klinecharts';

const chart = init('setScrollEnabled-chart');

chart.setScrollEnabled(false);

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
