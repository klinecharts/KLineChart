import { init } from 'klinecharts';

const chart = init('getPrecision-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const precision = chart.getPrecision();
