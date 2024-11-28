import { init } from 'klinecharts';

const chart = init('createOverlay-basic-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

chart.createOverlay('segment');