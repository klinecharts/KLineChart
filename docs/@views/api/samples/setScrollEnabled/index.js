import { init } from 'klinecharts';

const chart = init('setScrollEnabled-chart');

chart.setScrollEnabled(false);

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
