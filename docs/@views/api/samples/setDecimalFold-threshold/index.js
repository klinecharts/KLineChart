import { init } from 'klinecharts';

const chart = init('setDecimalFold-threshold-chart');

chart.setPrecision({ price: 10 });
chart.setDecimalFold({ threshold: 1000 });

fetch('/datas/kline2.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
