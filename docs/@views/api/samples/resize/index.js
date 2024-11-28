import { init } from 'klinecharts';

const chart = init('resize-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

chart.resize();
