import { init } from 'klinecharts';

const chart = init('setMaxOffsetRightDistance-chart');
chart.setMaxOffsetRightDistance(160);

fetch('https://klinecharts.com/datas/kline.json')
  .then(res => res.json())
  .then(dataList => { chart.applyNewData(dataList); });
