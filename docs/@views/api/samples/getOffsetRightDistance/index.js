import { init } from 'klinecharts';

const chart = init('getOffsetRightDistance-chart');

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });

const distance = chart.getOffsetRightDistance();
