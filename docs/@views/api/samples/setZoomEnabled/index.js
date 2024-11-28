import { init } from 'klinecharts';

const chart = init('setZoomEnabled-chart');

chart.setZoomEnabled(false);

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
