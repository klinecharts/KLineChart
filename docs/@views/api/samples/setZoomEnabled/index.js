import { init } from 'klinecharts';

const chart = init('setZoomEnabled-chart');

chart.setZoomEnabled(false);

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
