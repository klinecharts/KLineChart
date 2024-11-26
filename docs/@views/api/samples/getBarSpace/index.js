import { init } from 'klinecharts';

const chart = init('getBarSpace-chart');

fetch('/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const barSpace = chart.getBarSpace()