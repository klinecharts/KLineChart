import { init } from 'klinecharts';

const chart = init('init-basic-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
